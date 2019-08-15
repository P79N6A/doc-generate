/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document', {
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER(16),
      allowNull: false,
      primaryKey: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_edit_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    need_submit_issue: {
      type: DataTypes.INTEGER(8),
      allowNull: false
    }
  }, {
    tableName: 'document'
  });
};
