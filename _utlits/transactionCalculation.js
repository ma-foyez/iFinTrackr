const Profile = require("../models/peopleModal");

const managePeopleCalculation = async (personaId, amount, transactionType) => {
    const getUserById = await Profile.findOne({ _id: personaId });
    const { total_liabilities, total_payable, due_liabilities, due_payable } = getUserById;

    let TotalLiabilities = total_liabilities;
    let totalPayable = total_payable;
    let dueLiabilities = due_liabilities;
    let duePayable = due_payable;

    if (transactionType == "liabilities") {
        if (duePayable > 0) {
            duePayable -= amount;
        } else {
            // dueLiabilities += amount;
            dueLiabilities = (total_liabilities + amount) - total_payable;
        }
        TotalLiabilities += amount;
    } else {
        if (dueLiabilities > 0) {
            dueLiabilities -= amount;
        } else {
            // duePayable += amount;
            duePayable = (total_payable + amount) - total_liabilities;
        }
        totalPayable += amount;
    }

    // To check if due liabilities or due payable will be minus
    if (dueLiabilities < 0) {
        duePayable += dueLiabilities;
        dueLiabilities = 0
    } else if (duePayable < 0) {
        dueLiabilities += duePayable;
        duePayable = 0;
    } 

    return {
        TotalLiabilities,
        totalPayable,
        dueLiabilities,
        duePayable
    };
};



module.exports = { managePeopleCalculation }