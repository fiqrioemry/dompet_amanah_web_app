import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Donation extends Model {
    static associate(models: any) {
      Donation.belongsTo(models.User, { foreignKey: "userId" });
      Donation.belongsTo(models.Program, { foreignKey: "programId" });
      Donation.hasOne(models.Receipt, { foreignKey: "donationId" });
    }
  }

  Donation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.ENUM("transfer", "ewallet", "credit_card", "qris"),
        allowNull: false,
      },
      paymentRef: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Donation",
      tableName: "Donations",
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );

  return Donation;
};
