import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class ProgramAudit extends Model {
    static associate(models: any) {
      ProgramAudit.belongsTo(models.Program, { foreignKey: "programId" });
      ProgramAudit.belongsTo(models.User, {
        foreignKey: "reviewerId",
        as: "Reviewer",
      });
    }
  }

  ProgramAudit.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reviewerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ProgramAudit",
      tableName: "ProgramAudits",
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );

  return ProgramAudit;
};
