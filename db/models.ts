import { Model, DataTypes } from "https://deno.land/x/denodb@v1.1.0/mod.ts";

// Rather than having every single piece of data as a string
// Its proper database practice to have multiple tables

export class StringMetric extends Model {
  static table = "string_metrics";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
  };
}

export class IntegerMetric extends Model {
  static table = "integer_metrics";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    value: { type: DataTypes.INTEGER },
  };
}

export class FloatMetric extends Model {
  static table = "float_metrics";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    value: { type: DataTypes.FLOAT },
  };
}
