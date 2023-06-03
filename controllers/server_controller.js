

import { request } from 'express';
import client from '../config/database_configuration.js'







async function ServerExists(ipadress) {
    try {
        const ServerQuery = {
            text: 'SELECT * FROM addresses WHERE ipadress = $1',
            values: [ipadress],
        };
        const ServerResult = await client.query(ServerQuery);
        return (
            (ServerResult && ServerResult.rows.length > 0)
        );
    }
    catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }

}

const createServer = async (request, response) => {
    const { imageurl, ipadress, name, memory, type, status, user_id } = request.body;



    try {
        const exists = await ServerExists(ipadress);
        if (exists) {
            response.status(409).send({ message: 'Server already exists' })
            return;
        }
        await client.query(
            "INSERT INTO addresses (imageurl, ipadress,name,memory,type,status, user_id) VALUES ($1, $2, $3, $4, $5, $6 , $7 ) RETURNING *",
            [imageurl, ipadress, name, memory, type, status, user_id],
            (error, results) => {
                if (error) {
                    throw error;
                }
                response.status(201).send(`Server added with ID: ${results.rows[0].server_id}`);
            }
        )
    } catch (error) {
        console.error('Error saving Server to the database:', error);
        throw error;

    }

};

const viewServersById = async (request, response) => {
    const user_id = parseInt(request.params.id)
    try {
        await client.query('SELECT * FROM addresses WHERE user_id = $1', [user_id], (error, results) => {
            if (error) {
                throw error;
            }
            return response.status(200).send(results.rows);
        })
    } catch (error) {
        console.error('Error saving user to the database:', error);
        throw error;
    }
}

export default { createServer, viewServersById }