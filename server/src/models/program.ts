import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Program extends Model {
    static associate(models: any) {
      Program.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });
      Program.hasMany(models.Donation, { foreignKey: "programId" });
      Program.hasMany(models.ProgramLog, { foreignKey: "programId" });
      Program.hasMany(models.ProgramAudit, { foreignKey: "programId" });
    }
  }

  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      target_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      collected_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deadline: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM("draft", "active", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "draft",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Program",
      tableName: "Programs",
      timestamps: true,
    }
  );

  return Program;
};
