/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_document', {
    user_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    document_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'document',
        key: 'id'
      }
    }
  }, {
    tableName: 'user_document'
  });
};
