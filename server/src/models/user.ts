import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class User extends Model {
    static associate(models: any) {
      User.hasMany(models.Program, { foreignKey: "createdBy" });
      User.hasMany(models.Donation, { foreignKey: "userId" });
      User.hasMany(models.ProgramLog, { foreignKey: "updatedBy" });
      User.hasMany(models.ProgramAudit, { foreignKey: "reviewerId" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "donor", "reviewer"),
        allowNull: false,
        defaultValue: "donor",
      },
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
