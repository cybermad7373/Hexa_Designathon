import { PrismaClient, Role } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const user = await db.user.upsert({
    where: { email: "demo@hexa.dev" },
    update: {},
    create: {
      email: "demo@hexa.dev",
      name: "Demo Operator",
    },
  });

  const workspace = await db.workspace.upsert({
    where: { slug: "hexa-demo" },
    update: {},
    create: {
      name: "Hexa Demo",
      slug: "hexa-demo",
    },
  });

  await db.membership.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: { role: Role.OWNER },
    create: { userId: user.id, workspaceId: workspace.id, role: Role.OWNER },
  });

  await db.emailPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const auditCount = await db.auditLog.count({
    where: { workspaceId: workspace.id, action: "workspace.seeded" },
  });

  if (auditCount === 0) {
    await db.auditLog.create({
      data: {
        workspaceId: workspace.id,
        actorId: user.id,
        action: "workspace.seeded",
        entity: "Workspace",
        entityId: workspace.id,
        metadata: { source: "prisma/seed.ts" },
      },
    });
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  await db.emailMessage.upsert({
    where: { idempotencyKey: `welcome:${user.email}:seed` },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      toEmail: user.email,
      template: "welcome",
      subject: "Welcome to Hexa Demo",
      payload: { name: user.name ?? "there", loginUrl: appUrl },
      idempotencyKey: `welcome:${user.email}:seed`,
    },
  });

  console.log(`Seeded workspace "${workspace.name}" with owner ${user.email}`);
  console.log("Queued one welcome email. Process it with: npm run email:process");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
