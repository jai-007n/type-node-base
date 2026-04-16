const _ = require('lodash');
const errorBag = require('../../utility/common');
const { Client, validateClient } = require('../../model/client.model');
// const excel = require("exceljs");

async function updateClient(req, res) {

    let { error } = validateClient(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        let sendResult = _.pick(req.body, ['name', 'description', 'address', 'contact'])
        const result = await Client.findByIdAndUpdate(req.params.id, {
            $set: sendResult
        }, { new: true })

        res.status(200).json({
            status: true,
            code: 200,
            message: "Client Update",
            cient: result
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

async function deleteClient(req, res) {
    try {
        const result = await Client.findByIdAndDelete(req.params.id)
        if (!result)
            return res.status(404).json({
                status: false,
                code: 404,
                message: "The client with the given ID was not found.",
            });
        res.status(200).json({
            status: true,
            code: 200,
            message: "Client deleted",
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

async function createNewClient(req, res) {

    let { error } = validateClient(req.body);
    if (error) return res.status(422).send(errorBag(error));
    try {
        let sendResult = _.pick(req.body, ['name', 'description', 'address', 'contact'])
        let result = new Client(sendResult);
        result = await result.save();

        res.status(200).json({
            status: true,
            code: 200,
            message: "Client created",
            client: result
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

async function getClient(req, res) {
    const result = await Client.findById(req.params.id)

    if (!result) return res.status(404).json({
        status: false,
        code: 404,
        message: "The cleint with the given ID was not found.",
    });
    try {
        res.status(200).json({
            status: true,
            code: 200,
            message: "client profile",
            client: result
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

async function clientList(req, res) {
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.offset) || 16;
    const skip = Number((pageNumber - 1) * pageSize)
    let totalCount = 1
    let sortObject = {}
    const sortKey = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    sortObject[sortKey] = (sortOrder === 'desc') ? -1 : 1
    try {
        let queryTry = Client.find();
        let countDocuments = Client.countDocuments({});
        if (req.query.name !== undefined && req.query.name !== '' && req.query.name !== 'null') {
            queryTry = queryTry.and([{
                $or: [{ name: new RegExp(req.query.name, 'i') }]
            }]);
            countDocuments = countDocuments.and({
                $or: [{ name: new RegExp(req.query.name, 'i') }]
            });
        }

        queryTry = queryTry.skip(skip)
            .limit(pageSize)
            .sort(sortObject)
        // .sort({name: 1})

        totalCount = await countDocuments
        const result = await queryTry
        res.status(200).json({
            status: true,
            code: 200,
            count: result.length,
            message: "client List",
            list: result, pageNumber,
            totalPages: Math.ceil(totalCount / pageSize)
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

// async function downloadClientList(req, res) {

//     let sortObject = {}
//     const sortKey = req.query.sortBy || 'name';
//     const sortOrder = req.query.sortOrder || 'asc';
//     sortObject[sortKey] = (sortOrder === 'desc') ? -1 : 1
//     let workbook = new excel.Workbook();
//     let worksheet = workbook.addWorksheet("Clients");
//     worksheet.columns = [
//         { header: "Id", key: "index", width: 5 },
//         { header: "Service Type Name", key: "name", width: 60 },
//     ];
//     try {
//         let queryTry = Client.find({});

//         if (req.query.name !== undefined && req.query.name !== '' && req.query.name !== 'null') {

//             queryTry = queryTry.and([{
//                 $or: [{ name: new RegExp(req.query.name, 'i') }]
//             }
//             ]);
//         }

//         queryTry = queryTry
//             .sort(sortObject)
//         // .sort({name: 1})

//         const result = await queryTry

//         let cTips = [];

//         result.forEach((report, index22) => {
//             cTips.push({
//                 index: index22 + 1,
//                 name: report?.name,
//             });
//         })

//         worksheet.addRows(cTips);

//         // Making first line in excel bold
//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true };
//         });

//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=" + "Clients.xlsx"
//         );
//         return workbook.xlsx.write(res).then(function () {
//             res.status(200).end();
//         });
//     } catch (ex) {
//         res.status(400).json({
//             status: false,
//             code: 400,
//             message: ex.message,
//             list: ''
//         });
//     }
// }

async function updateMyStatus(req, res) {
    try {
        let result = await Client.findOne({ _id: req.params.id })
        if (!result) return res.status(404).json({
            status: false,
            code: 404,
            message: "The client with the given ID was not found.",
        });
        let msg = ''
        if (result.isActive) {
            msg = "Client Deactivated"
        } else {
            msg = "Client Activated"
        }
        result.isActive = !result.isActive
        result = await result.save()
        res.status(200).json({
            status: true,
            code: 200,
            message: msg,
            user: result
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

// async function removeImage(req, res) {

//     try {
//         let result = await Client.findOne({ _id: req.params.id })
//         if (!result) return res.status(404).json({
//             status: false,
//             code: 404,
//             message: "The service type with the given ID was not found.",

//         });

//         if (result?.icon !== undefined) {
//             //s3 result removing code
//             //             let removeFile = result.icon.split('/').slice(-1)[0];
//             //             let s3Result = await deleteS3Object('services', removeFile, async function (err) {
//             //                 // if (err) {
//             //                 //     return res.status(400).json({
//             //                 //         status: false,
//             //                 //         code: 400,
//             //                 //         message: "Something went wrong",
//             //                 //         banner: ''
//             //                 //     });
//             //                 // }
//             //                 if (err) {
//             //                     return next(err)
//             //                 }
//             //                 result.icon = null
//             //                 result = await result.save()
//             //             });
//             result.icon = null
//             result = await result.save()
//         }

//         res.status(200).json({
//             status: true,
//             code: 200,
//             message: "Icon removed successfully",
//             service: result
//         });
//     } catch
//     (ex) {
//         res.status(400).json({
//             status: false,
//             code: 400,
//             message: ex.message,
//         });
//     }
// }

// module.exports.removeImage = removeImage;
// module.exports.downloadClientList = downloadClientList;
module.exports.updateMyStatus = updateMyStatus
module.exports.updateClient = updateClient;
module.exports.deleteClient = deleteClient;
module.exports.createNewClient = createNewClient;
module.exports.getClient = getClient;
module.exports.clientList = clientList;