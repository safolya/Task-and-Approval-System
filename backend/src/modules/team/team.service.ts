
import mongoose from "mongoose";
import teamSchema from "../../models/teamSchema";
import createAuditLog from "../../service/audit.service";

interface CreateTeamInput {
  name: string;
  userId: string;
}

export const createTeam = async ({
  name,
  userId
}: CreateTeamInput) => {
  const session = await mongoose.startSession();

  try {
    let createdTeam;

    await session.withTransaction(async () => {
      const teams = await teamSchema.create(
        [
          {
            name,
            createdBy: userId
          }
        ],
        { session }
      );

      if (!teams[0]) {
        throw new Error("TEAM_CREATION_FAILED");
      }

      createdTeam = teams[0];

      await createAuditLog({
        actor: userId as unknown as mongoose.Types.ObjectId,
        action: "TEAM_CREATED",
        target: createdTeam._id,
        metadata: { teamName: name },
        session
      });
    });

    return {
      id: createdTeam!._id.toString(),
      name: createdTeam!.name,
      createdBy: createdTeam!.createdBy
    };

  } finally {
    session.endSession();
  }
};