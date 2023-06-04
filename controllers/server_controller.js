
import axios from 'axios'
import { request, response } from 'express';
import client from '../config/database_configuration.js'


async function checkUrl(url) {
    let status;
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            status = 'SERVER UP'
        } else {
            status = 'SERVER DOWN'
        }
    } catch (error) {
        status = 'SERVER DOWN'
    }
    return status;
}
checkUrl('http://127.0.0.1:3500').then(data => {

    console.log(data)
})



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
    let status;
    const { imageurl, ipadress, name, memory, type, user_id } = request.body;

    checkUrl(`http://${ipadress}`).then(data => {
        status = data;
    }).catch((error) => {
        status = error;
    })

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

const getAllServers = async (request, response) => {
    try {
        await client.query('SELECT * FROM addresses ORDER BY server_id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            return response.status(200).send(results.rows)
        })
    } catch (error) {
        console.error('Error saving user to the database:', error);
        throw error;
    }
}

const updateServer = (request, response) => {
    let status;
    const server_id = parseInt(request.params.id)
    const { ipadress } = request.body

    checkUrl(`http://${ipadress}`).then(status => {
        client.query(
            'UPDATE addresses SET ipadress = $1 , status = $2 WHERE server_id = $3',
            [ipadress, status, server_id],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(200).send(`User modified with ID: ${server_id}`)
            }
        )

    }).catch((error) => {
        status = error;
    })


}

export default { createServer, viewServersById, getAllServers, updateServer }