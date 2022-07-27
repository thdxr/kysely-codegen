import { Adapter } from '../../adapter';
import { GenericExpressionNode } from '../../nodes/generic-expression-node';
import { IdentifierNode } from '../../nodes/identifier-node';
import { ObjectExpressionNode } from '../../nodes/object-expression-node';
import { PropertyNode } from '../../nodes/property-node';
import { UnionExpressionNode } from '../../nodes/union-expression-node';

export class PostgresAdapter extends Adapter {
  // From https://node-postgres.com/features/types:
  // "node-postgres will convert a database type to a JavaScript string if it doesn't have a
  // registered type parser for the database type. Furthermore, you can send any type to the
  // PostgreSQL server as a string and node-postgres will pass it through without modifying it in
  // any way."
  override readonly defaultType = new IdentifierNode('string');
  override readonly definitions = {
    Circle: new ObjectExpressionNode([
      new PropertyNode('x', new IdentifierNode('number')),
      new PropertyNode('y', new IdentifierNode('number')),
      new PropertyNode('radius', new IdentifierNode('number')),
    ]),
    Int8: GenericExpressionNode.createColumnType(
      new IdentifierNode('string'),
      new UnionExpressionNode([
        new IdentifierNode('string'),
        new IdentifierNode('number'),
        new IdentifierNode('bigint'),
      ]),
    ),
    Interval: GenericExpressionNode.createColumnType(
      new IdentifierNode('IPostgresInterval'),
      new UnionExpressionNode([
        new IdentifierNode('IPostgresInterval'),
        new IdentifierNode('number'),
      ]),
    ),
    Numeric: GenericExpressionNode.createColumnType(
      new IdentifierNode('string'),
      new UnionExpressionNode([
        new IdentifierNode('string'),
        new IdentifierNode('number'),
      ]),
    ),
    Point: new ObjectExpressionNode([
      new PropertyNode('x', new IdentifierNode('number')),
      new PropertyNode('y', new IdentifierNode('number')),
    ]),
    Timestamp: GenericExpressionNode.createColumnType(
      new IdentifierNode('Date'),
      new UnionExpressionNode([
        new IdentifierNode('Date'),
        new IdentifierNode('string'),
      ]),
    ),
  };
  override readonly imports = {
    IPostgresInterval: 'postgres-interval',
  };
  // These types have been found through experimentation in Adminer and in the 'pg' source code.
  override readonly types = {
    bit: new IdentifierNode('string'),
    bool: new IdentifierNode('boolean'), // Specified as "boolean" in Adminer.
    box: new IdentifierNode('string'),
    bpchar: new IdentifierNode('string'), // Specified as "character" in Adminer.
    bytea: new IdentifierNode('Buffer'),
    cidr: new IdentifierNode('string'),
    circle: new IdentifierNode('Circle'),
    date: new IdentifierNode('Timestamp'),
    float4: new IdentifierNode('number'), // Specified as "real" in Adminer.
    float8: new IdentifierNode('number'), // Specified as "double precision" in Adminer.
    inet: new IdentifierNode('string'),
    int2: new IdentifierNode('number'), // Specified in "pg" source code.
    int4: new IdentifierNode('number'), // Specified in "pg" source code.
    int8: new IdentifierNode('Int8'), // Specified as "bigint" in Adminer.
    interval: new IdentifierNode('Interval'),
    json: new IdentifierNode('number'),
    jsonb: new IdentifierNode('number'),
    line: new IdentifierNode('string'),
    lseg: new IdentifierNode('string'),
    macaddr: new IdentifierNode('string'),
    money: new IdentifierNode('string'),
    numeric: new IdentifierNode('Numeric'),
    oid: new IdentifierNode('number'), // Specified in "pg" source code.
    path: new IdentifierNode('string'),
    point: new IdentifierNode('Point'),
    polygon: new IdentifierNode('string'),
    text: new IdentifierNode('string'),
    time: new IdentifierNode('string'),
    timestamp: new IdentifierNode('Timestamp'),
    timestamptz: new IdentifierNode('Timestamp'),
    tsquery: new IdentifierNode('string'),
    tsvector: new IdentifierNode('string'),
    txid_snapshot: new IdentifierNode('string'),
    uuid: new IdentifierNode('string'),
    varbit: new IdentifierNode('string'), // Specified as "bit varying" in Adminer.
    varchar: new IdentifierNode('string'), // Specified as "character varying" in Adminer.
    xml: new IdentifierNode('string'),
  };
}
