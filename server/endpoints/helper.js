const { Sequelize } = require("sequelize");

// Función para dar formato a las fechas para el input de tipo date en el front
formatDateAttribute = (fieldName, alias = null) => {
    const formattedDateAttribute = [
        Sequelize.fn('DATE_FORMAT', Sequelize.col(fieldName), '%Y-%m-%d'),
        alias ?? fieldName
    ];
    return formattedDateAttribute;
};

module.exports = {
    formatDateAttribute
};
