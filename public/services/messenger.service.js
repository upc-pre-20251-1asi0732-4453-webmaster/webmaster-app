import axios from 'axios';
import {environment} from "@/environment/environment.js";
// import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export default {

    // async createMessage(message) {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             throw new Error('Token not found');
    //         }
    //
    //         const decodedToken = jwtDecode(token);
    //         const senderId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
    //         if (!senderId) {
    //             throw new Error('Sender ID not found in token');
    //         }
    //
    //         message.append('senderId', senderId);
    //
    //         const response = await http.post('/Messages', message, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error creating message:', error);
    //         console.log(error.response);
    //         throw error;
    //     }
    // },
    async getUsersFilteredByUserType(userType) {

        try {
            let contacts = [];

            if (userType === 'enterprises') {
                const response = await http.get('/developers');
                const developers = response.data;

                // Extraer y transformar solo los campos necesarios
                contacts = developers.map(dev => ({
                    id: dev.id,
                    name: `${dev.firstName} ${dev.lastName}`,
                    avatar: dev.profileImgUrl,
                    userId: dev.userId
                }));

            } else if (userType === 'developers') {
                const response = await http.get('/enterprises');
                const enterprises = response.data;

                // Extraer y transformar solo los campos necesarios
                contacts = enterprises.map(ent => ({
                    id: ent.id,
                    name: ent.enterpriseName,
                    avatar: ent.profileImgUrl,
                    userId: ent.userId
                }));
            }

            console.log(contacts);

            // Paso 2: Eliminar todos los usuarios actuales de json-server
            const existingUsersRes = await fetch('http://localhost:3001/users');
            const existingUsers = await existingUsersRes.json();

            for (const user of existingUsers) {
                await fetch(`http://localhost:3001/users/${user.id}`, {
                    method: 'DELETE'
                });
            }

            // Paso 3: Insertar los nuevos usuarios
            for (const contact of contacts) {
                await fetch('http://localhost:3001/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contact)
                });
            }

            console.log('Contacts sent to JSON Server:', contacts);
            return contacts;


        } catch (error) {
            console.error('Error fetching or filtering users:', error);
        }
    },

    async sendMessage(message) {
        const senderId = message.senderId;

        const newMessage = {
            receipientId: message.recipientId,
            content: message.emailBody,
            createdAt: new Date().toISOString()
        };

        try {
            // 1. Buscar chat existente por senderId
            const response = await axios.get(`http://localhost:3001/chats?senderId=${senderId}`);
            let chat = response.data[0];

            if (chat) {
                // 2. Si existe, agregar mensaje y actualizar chat (PUT)
                chat.messages.push(newMessage);
                await axios.put(`http://localhost:3001/chats/${chat.id}`, chat);
            } else {
                // 3. Si no existe, crear chat nuevo (POST)
                chat = {
                    senderId: senderId,
                    messages: [newMessage]
                };
                await axios.post('http://localhost:3001/chats', chat);
            }

            return chat; // Retornas el chat actualizado o creado
        } catch (error) {
            console.error('Error sending message to JSON server:', error);
            throw error;
        }
    },
    async sendFileMessage(message) {
        const senderId = message.senderId;

        try {
            const file = message.file;

            // Convertir archivo a base64 usando FileReader dentro de la función
            const base64Content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            let newMessage = {
                receipientId: message.recipientId,
                content: file.name,
                fileContent: base64Content,
                fileType: file.type,
                createdAt: new Date().toISOString(),
                fileUrl: "" // lo llenaremos luego
            };

            // Buscar si ya existe un chat
            const response = await axios.get(`http://localhost:3001/chats?senderId=${senderId}`);
            let chat = response.data[0];
            let messageIndex;

            if (chat) {
                chat.messages.push(newMessage);
                messageIndex = chat.messages.length - 1;

                // Establecer el fileUrl
                chat.messages[messageIndex].fileUrl = `/chats/${chat.id}/messages/${messageIndex}`;

                // Actualizar el chat
                await axios.put(`http://localhost:3001/chats/${chat.id}`, chat);
            } else {
                chat = {
                    senderId: senderId,
                    messages: [newMessage]
                };

                // Crear el chat
                const postResponse = await axios.post('http://localhost:3001/chats', chat);

                // Obtener ID asignado por JSON Server
                const createdChat = postResponse.data;
                const path = `/chats/${createdChat.id}/messages/0`;
                createdChat.messages[0].fileUrl = path;

                // Hacer PUT para actualizar con el fileUrl
                await axios.put(`http://localhost:3001/chats/${createdChat.id}`, createdChat);

                chat = createdChat;
            }

            console.log("Archivo guardado en:", chat.messages[messageIndex || 0].fileUrl);

            return chat;

        } catch (error) {
            console.error('Error sending file message:', error);
            throw error;
        }
    }

    ,
    async getMessagesByUsers(senderId, recipientId) {
        try {
            let response1 = await axios.get(`http://localhost:3001/chats?senderId=${senderId}`);
            let response2 = await axios.get(`http://localhost:3001/chats?senderId=${recipientId}`);

            let chats = response1.data.concat(response2.data);

            let allMessages = [];

            chats.forEach(chat => {
                if (chat.messages && chat.messages.length > 0) {
                    let filteredMessages = chat.messages
                        .filter(m =>
                            (chat.senderId === senderId && m.receipientId === recipientId) ||
                            (chat.senderId === recipientId && m.receipientId === senderId)
                        )
                        .map(m => ({
                            content: m.content,
                            createdAt: m.createdAt,
                            recipientId: m.receipientId,
                            senderId: chat.senderId,
                            fileContent: m.fileContent || null,
                            fileType: m.fileType || null,
                            fileUrl: m.fileUrl || null
                        }));

                    allMessages = allMessages.concat(filteredMessages);
                }
            });

            allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            console.log("CHAT DESDE BACKEND", allMessages);

            return allMessages;

        } catch (error) {
            console.error("Error fetching messages from API:", error);
            throw error;
        }
    },
    async getFileByUrl(fileUrl) {
        try {
            const match = fileUrl.match(/\/chats\/(\d+)\/messages\/(\d+)/);
            if (!match) {
                throw new Error("Formato de ruta de archivo inválido.");
            }

            const chatId = match[1];
            const messageIndex = match[2];

            const response = await axios.get(`http://localhost:3001/chats/${chatId}`);
            console.log(`Intentando bajar desde \`http://localhost:3001/chats/${chatId}\``)
            const chat = response.data;

            const message = chat.messages[messageIndex];

            if (!message || !message.fileContent) {
                throw new Error("Archivo no encontrado o sin contenido.");
            }

            return {
                fileContent: message.fileContent,
                fileType: message.fileType,
                fileName: message.content
            };

        } catch (error) {
            console.error("Error obteniendo archivo desde JSON server:", error);
            throw error;
        }
    }


};
