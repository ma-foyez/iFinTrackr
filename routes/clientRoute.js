const express = require("express");
const { createClient, getClientList, getClientDetails, updateClient, deleteClient } = require("../controllers/clientController");
const { authenticateToken } = require("../config/generateToken");
const ClientRoute = express.Router();

// Apply authenticateToken middleware to protect routes
ClientRoute.route('/create-client').post(authenticateToken, createClient);
ClientRoute.route('/update-client').put(authenticateToken, updateClient);
ClientRoute.route('/client-list').get(authenticateToken, getClientList);
ClientRoute.route('/client-details/:id').get(authenticateToken, getClientDetails);
ClientRoute.route('/delete-client/:id').delete(authenticateToken, deleteClient);

module.exports = ClientRoute;
