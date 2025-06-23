import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Receipt extends Model {
    static associate(models: any) {
      Receipt.belongsTo(models.Donation, { foreignKey: "donationId" });
    }
  }

  Receipt.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      donationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      pdfUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Receipt",
      tableName: "Receipts",
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );

  return Receipt;
};
