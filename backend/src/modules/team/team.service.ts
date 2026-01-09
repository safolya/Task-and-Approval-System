
import mongoose from "mongoose";
import teamSchema from "../../models/teamSchema";
import teamInvite from "../../models/teamInvite";
import teamMember from "../../models/teamMember";
import createAuditLog from "../../service/audit.service";
import crypto from "crypto";

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


//invite

interface CreateTeamInvite {
  teamId: string;
  email: string;
}

export const invite = async ({
  teamId,
  email
}: CreateTeamInvite) => {
  const teamExists = await teamSchema.exists({ _id: teamId });
  if (!teamExists) {
    throw new Error("TEAM_NOT_FOUND");
  }

  const existingInvite = await teamInvite.findOne({
    teamId,
    email,
    status: "PENDING"
  });

  if (existingInvite) {
    throw new Error("INVITE_ALREADY_SENT");
  }

  const invite = await teamInvite.create({
    teamId,
    email,
    role: "MEMBER",
    status: "PENDING",
    token: crypto.randomBytes(32).toString("hex"),
  });

  return {
    id: invite._id.toString(),
    email: invite.email,
    role: invite.role,
    status: invite.status
  };
};


//accept invite

interface AcceptInviteInput {
  token: string,
  userId:string
}

export const acceptTeamInvite = async ({
  token,
  userId
}: AcceptInviteInput) => {
  const session = await mongoose.startSession();

  try {
    let createdMember;

    await session.withTransaction(async () => {

      const invite = await teamInvite.findOne({
        token,
        status: "PENDING"
      }).session(session);

      if (!invite) {
        throw new Error("INVITE_NOT_FOUND");
      }

      const alreadyMember = await teamMember.exists({
        userId:userId
      });

      if (alreadyMember) {
        throw new Error("ALREADY_MEMBER");
      }

      const members = await teamMember.create(
        [
          {
            teamId: invite.teamId,
            userId:userId,
            role: invite.role
          }
        ],
        { session }
      );

      createdMember = members[0];

      invite.status = "ACCEPT";
      await invite.save({ session });
    });

    return {
      id: createdMember!._id.toString(),
      userId:createdMember!.userId,
      teamId: createdMember!.teamId,
      role: createdMember!.role
    };

  } finally {
    session.endSession();
  }
};