# DiasporaLink — Pulumi Infrastructure (TypeScript alternative to Terraform)
# Usage:
#   pulumi up -s production
#   pulumi config set aws:region eu-west-1

import * as aws from "@pulumi/aws"
import * as awsx from "@pulumi/awsx"

const config = new pulumi.Config()
const env = config.require("environment") || "production"

// --- S3: File uploads ---
const uploadsBucket = new aws.s3.Bucket("diasporalink-uploads", {
  bucket: `diasporalink-uploads-${env}`,
  corsRules: [{
    allowedHeaders: ["*"],
    allowedMethods: ["GET", "PUT", "POST"],
    allowedOrigins: [config.require("frontendDomain")],
    exposeHeaders: ["ETag"],
    maxAgeSeconds: 3600,
  }],
})

new aws.s3.BucketPublicAccessBlock("uploads-block-public", {
  bucket: uploadsBucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
})

// --- RDS: PostgreSQL ---
const dbSubnetGroup = new aws.rds.SubnetGroup("diaspora-db-subnet", {
  subnetIds: config.requireObject<string[]>("privateSubnetIds"),
})

const dbSecurityGroup = new aws.ec2.SecurityGroup("diaspora-db-sg", {
  description: "PostgreSQL access",
  ingress: [{
    fromPort: 5432, toPort: 5432, protocol: "tcp",
    securityGroups: [],
  }],
})

const db = new aws.rds.Instance("diaspora-db", {
  engine: "postgres",
  engineVersion: "16.3",
  instanceClass: config.require("dbInstanceClass") || "db.t4g.micro",
  allocatedStorage: config.requireNumber("dbAllocatedStorage") || 20,
  dbName: "diaspora_platform",
  username: config.requireSecret("dbUsername"),
  password: config.requireSecret("dbPassword"),
  dbSubnetGroupName: dbSubnetGroup.name,
  vpcSecurityGroupIds: [dbSecurityGroup.id],
  backupRetentionPeriod: 30,
  storageEncrypted: true,
  deletionProtection: env === "production",
})

// --- ECS: API ---
const cluster = new aws.ecs.Cluster("diaspora-cluster")

const apiTask = new awsx.ecs.FargateTaskDefinition("api-task", {
  containers: {
    api: {
      image: config.require("apiImage"),
      portMappings: [{ containerPort: 4000 }],
      environment: [
        { name: "NODE_ENV", value: env },
        { name: "DATABASE_URL", value: pulumi.interpolate`postgresql://${config.require("dbUsername")}:${config.requireSecret("dbPassword")}@${db.address}:5432/diaspora_platform` },
        { name: "FRONTEND_URL", value: config.require("frontendDomain") },
      ],
    },
  },
})

export const bucketName = uploadsBucket.bucket
export const dbEndpoint = db.address
export const apiUrl = pulumi.interpolate`https://api.${config.require("domain")}`
