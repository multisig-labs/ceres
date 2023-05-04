// See here for why I'm using this seemingly random
// source: https://github.com/eveningkid/denodb/issues/379#issuecomment-1445411440
// Revert back to official version when this is fixed
// import { DataTypes, Model } from "https://deno.land/x/denodb@v1.2.0/mod.ts";
import {
  DataTypes,
  Model,
} from "https://raw.githubusercontent.com/jerlam06/denodb/1b2e53461df56673d4048fe357c4d5ffaf5d8b1e/mod.ts";

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
