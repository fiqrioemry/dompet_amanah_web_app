import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class ProgramLog extends Model {
    static associate(models: any) {
      ProgramLog.belongsTo(models.Program, { foreignKey: "programId" });
      ProgramLog.belongsTo(models.User, {
        foreignKey: "updatedBy",
        as: "Updater",
      });
    }
  }

  ProgramLog.init(
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
      status: {
        type: DataTypes.ENUM,
        values: ["created", "in_progress", "completed", "cancelled"],
        allowNull: false,
        defaultValue: "created",
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProgramLog",
      tableName: "ProgramLogs",
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );

  return ProgramLog;
};
