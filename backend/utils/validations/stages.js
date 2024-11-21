const { body } = require("express-validator");

const positions = require("../positions");

const firstStageValidation = [
    body("First_Name").notEmpty().escape().withMessage("First name is required"),
    body("Last_Name").notEmpty().escape().withMessage("Last name is required"),
    body("Email").isEmail().escape().normalizeEmail().withMessage("Email is invalid"),
    body("Phone").notEmpty().escape().isMobilePhone().withMessage("Phone number is invalid"),
    body("Date_of_Birth").notEmpty().escape().isDate().withMessage("Date of birth is invalid"),
    body("resume").notEmpty().escape().withMessage("Resume file is required"),
    body("position").notEmpty().escape().withMessage("Position is required"),
    body("position").custom(value => {
        if (!(value in positions)) {
            throw new Error("Invalid position");
        }
        return true;
    })
];

const secondStageValidation = [
    body("Skill_Set").isArray().withMessage("Skills must be an array"),
    body("Source").notEmpty().escape().withMessage("Source of application is required"),
    body("education").notEmpty().escape().withMessage("Education is required"),
];

module.exports = {
    firstStageValidation,
    secondStageValidation,
};
