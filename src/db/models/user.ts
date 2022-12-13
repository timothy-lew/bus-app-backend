import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  name?: string;
  email: string;
  pass_salt?: string;
  pass_hash?: string;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "name" | "email" | "pass_salt" | "pass_hash";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes> implements UserAttributes {
  id!: string;
  name!: string;
  email!: string;
  pass_salt?: string;
  pass_hash?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return sequelize.define('User',{
    id: {
      autoIncrement: true,
      // type: DataTypes.BIGINT,
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: true
    },
    pass_salt: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    pass_hash: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
  }, {
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }) as typeof User;
  }
}
