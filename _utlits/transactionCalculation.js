const Profile = require("../models/peopleModal");

const managePeopleCalculation = async (personaId, amount, transactionType) => {
    const getUserById = await Profile.findOne({ _id: personaId });
    const { total_liabilities, total_payable, due_liabilities, due_payable } = getUserById;

    let TotalLiabilities = total_liabilities;
    let totalPayable = total_payable;
    let dueLiabilities = due_liabilities;
    let duePayable = due_payable;

    if (transactionType == "liabilities") {
        TotalLiabilities += amount; // Previous Total Liabilities + Amount
        if(duePayable > 0){
            const newPayable = duePayable - amount;
            if(newPayable < 0){
                dueLiabilities += Math.abs(newPayable);
                duePayable = 0;
            }else{
                duePayable = Math.abs(newPayable);
                dueLiabilities = 0;
            }
        }else{
            // payable logics
            dueLiabilities += amount;
        }
    } else {
        totalPayable += amount; // Previous Total Payable + Amount
        if(dueLiabilities > 0){
            const newDueLiabilities = dueLiabilities - amount;
            if(newDueLiabilities < 0){
                duePayable += Math.abs(newDueLiabilities);
                dueLiabilities = 0;
            }else{
                dueLiabilities = Math.abs(newDueLiabilities);
                duePayable = 0;
            }
        }else{
            duePayable += amount;
        }
    }

    return {
        TotalLiabilities,
        totalPayable,
        dueLiabilities,
        duePayable
    };
};

module.exports = { managePeopleCalculation }