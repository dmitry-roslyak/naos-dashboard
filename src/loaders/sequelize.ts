import { Sequelize } from "sequelize";

let sequelizeDefaultOptions: any = {
  define: {
    underscored: true,
    timestamps: false,
  },
  logging: false,
};

if (process.env.SSL_ENABLED == "true") {
  sequelizeDefaultOptions["dialectOptions"] = {
    ssl: true,
  };
}

if (!process.env.DATABASE_URL) throw "DATABASE_URL is undefined";

export const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeDefaultOptions);
sequelize.authenticate().then(() => console.log("Sequelize connected"));
