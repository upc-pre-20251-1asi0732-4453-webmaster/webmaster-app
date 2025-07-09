import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import ws from 'ws';

let stompClient = null;
let currentSubscription = null;

export default {
    connectSocket(onError) {
        return new Promise((resolve, reject) => {
            if (stompClient) {
                resolve();
                return;
            }

            const ws = new WebSocket('ws://localhost:8080/ws');
            stompClient = Stomp.over(ws);

            stompClient.connect({}, () => {
                console.log('WebSocket conectado');
                resolve();
            }, (error) => {
                console.error('WebSocket connection error:', error);
                onError(error);
                reject(error);
            });
        });
    },

    subscribeToTopic(userId, projectId, userName, onMessageReceived) {
        if (!stompClient) {
            console.error('Socket is not connected');
            return;
        }
        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        stompClient.subscribe('/user/queue/errors', function (errorMessage) {
            alert("🚫 Error: " + errorMessage.body);
            disconnectAndReset();
        });

        currentSubscription = stompClient.subscribe(`/topic/project/${projectId}`, (messageOutput) => {
            onMessageReceived(JSON.parse(messageOutput.body));
        });

        console.log(userId);

        stompClient.send(`/app/chat.join.${projectId}`, {}, JSON.stringify({
            sender: userName,
            senderId: userId,
            projectId: projectId,
            type: 'JOIN'
        }));
    },

    disconnect() {
        if (stompClient !== null) {
            stompClient.disconnect();
            stompClient = null;
        }
    },

    sendMessage(projectId, username, userId, messageContent) {
        if (stompClient && messageContent) {
            const chatMessage = {
                sender: username,
                senderId: userId,
                content: messageContent,
                type: 'CHAT'
            };

            stompClient.send(`/app/chat.sendMessage.${projectId}`, {}, JSON.stringify(chatMessage));
        }
    },



    async loadChatHistory(projectId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/chat-messages/messages/${projectId}`);
            return response.data.content || [];
        } catch (error) {
            console.error("Error loading chat history:", error);
            throw error;
        }
    }
};
