<script>
import messengerService from "../../../public/services/messenger.service";
import axios from "axios";

export default {
  name: "chat-component",
  data() {
    return {
      currentMessages: [],
      searchQuery: "",
      contacts: [],
      selectedContactId: null,
      newMessage: "",
      isMobileView: false,
      showContactList: true,
      userId: null,
      userName: ""
    };
  },
  computed: {
    currentContact() {
      return this.contacts.find((c) => c.projectId === this.selectedContactId);
    },
    filteredContacts() {
      if (!this.searchQuery) return this.contacts;
      return this.contacts.filter((c) =>
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async connectToSocket() {
      try {
        await messengerService.connectSocket((error) => {
          console.error("WebSocket error:", error);
        });
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    },
    async selectContact(projectId) {
      if (this.selectedContactId === projectId) return;

      this.selectedContactId = projectId;

      // Suscribirse al nuevo topic
      messengerService.subscribeToTopic(
          this.userId,
          projectId,
          this.userName,
          (message) => this.onMessageReceived(message)
      );


      console.log("Project Id", projectId)
      // Cargar historial de mensajes
      let data = await messengerService.loadChatHistory(projectId);

      console.log(data, 'data');

      this.currentMessages = data.map((message) => {
        const isMine = message.senderId === this.userId;  // Comparar con el userId local
        return {
          id: message.timestamp || Date.now(),  // Usar timestamp como ID único
          content: message.content,
          time: new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: isMine,
        };
      });
      console.log(this.currentMessages);

      this.$nextTick(() => this.scrollToBottom());

      if (this.isMobileView) {
        this.showContactList = false;
      }
    },
    onMessageReceived(message) {
      const myId = localStorage.getItem("user id");
      if (message.senderId === myId) return;

      this.currentMessages.push({
        id: message.id || Date.now(),
        content: message.content,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine: false,
      });
      this.$nextTick(() => this.scrollToBottom());
    },
    async prepareAndSendMessage() {
      const text = this.newMessage.trim();
      if (!text || !this.currentContact) return;

      const senderId = localStorage.getItem("user id");
      const projectId = this.currentContact.projectId;

      messengerService.sendMessage(projectId, this.userName, senderId, text);

      this.currentMessages.push({
        id: Date.now(),
        content: text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine: true,
      });

      this.newMessage = "";
      this.$nextTick(() => this.scrollToBottom());
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    checkMobile() {
      this.isMobileView = window.innerWidth <= 768;
      if (this.isMobileView && this.selectedContactId) {
        this.showContactList = false;
      } else {
        this.showContactList = true;
      }
    },
    goBackToContacts() {
      this.showContactList = true;
      this.selectedContactId = null;
    },
  },
  created() {
    this.userId = localStorage.getItem("user id");
    this.userName = localStorage.getItem("user name");
  },
  async mounted() {
    await this.connectToSocket();
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);

    if (this.userId) {
      try {
        const response = await axios.get(
            `http://localhost:8080/api/v1/chats/user/${this.userId}`
        );
        this.contacts = response.data;
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
    messengerService.disconnect();
  },
};
</script>

<template>
  <div class="chat-container">
    <aside class="sidebar" :class="{ 'mobile-hidden': !showContactList }">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search conversations..."/>
      </div>
      <ul class="contact-list">
        <li
            v-for="contact in filteredContacts"
            :key="contact.projectId"
            :class="['contact-item', { active: contact.projectId === selectedContactId }]"
            @click="selectContact(contact.projectId)"
        >
          <div class="avatar-wrapper">
            <img :src="contact.ownerImgUrl" class="avatar" alt="Avatar"/>
            <span v-if="contact.online" class="online-indicator"></span>
          </div>
          <div class="contact-info">
            <p class="contact-name">{{ contact.projectName }}</p>
            <span
                v-if="contact.unreadCount > 0"
                class="unread-badge"
            >{{ contact.unreadCount }}</span>
          </div>
        </li>
      </ul>
    </aside>

    <section class="chat-area" :class="{ 'mobile-hidden': showContactList }">
      <header class="chat-header" v-if="currentContact">
        <div class="header-left">
          <button v-if="isMobileView" @click="goBackToContacts" class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          <img :src="currentContact.ownerImgUrl" class="header-avatar" alt="Avatar"/>
          <div class="header-info">
            <p class="header-name">{{ currentContact.projectName }}</p>
            <p class="header-status" v-if="currentContact.online">Online</p>
          </div>
        </div>
        <div class="header-actions">
          <span class="dot-menu">⋮</span>
        </div>
      </header>
      <header class="chat-header" v-else>
        <div class="header-left">
          <p class="header-name">Select a contact to chat</p>
        </div>
      </header>

      <div class="chat-messages" ref="messageContainer">
        <div
            v-for="message in currentMessages"
            :key="message.id"
            :class="['message-bubble', message.isMine ? 'sent' : 'received']"
        >
          <p class="message-content">
              {{ message.content }}
          </p>


          <span class="message-time">{{ message.time }}</span>
        </div>


        <div v-if="currentMessages.length === 0 && currentContact" class="no-messages">
          No messages in this conversation yet! Be the first to say hello.
        </div>
        <div v-if="!currentContact" class="no-messages-selected">
          Select a contact to start a conversation.
        </div>
      </div>

      <footer class="chat-input" v-if="currentContact">
        <input
            type="text"
            v-model="newMessage"
            placeholder="Type a message..."
            @keyup.enter="prepareAndSendMessage"
        />
        <button class="btn-send" @click="prepareAndSendMessage">
          ➤
        </button>
      </footer>
      <footer class="chat-input-disabled" v-else>
        <input type="text" placeholder="Select a contact to send messages..." disabled/>
      </footer>
    </section>
  </div>
</template>

<style scoped>
/* Contenedor principal: sidebar + chat */
.chat-container {
  display: flex;
  height: 70vh;
  width: 70vw;
  font-family: "Arial", sans-serif;
  margin: 0 auto;
  border-radius: 16px; /* Borde redondeado para el contenedor principal */
  overflow: hidden; /* Asegura que los hijos con bordes redondeados se vean bien */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para darle un toque flotante */
}

/* ---------------------- Sidebar ---------------------- */
.sidebar {
  width: 280px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  /* Eliminamos los border-radius individuales, se manejará por el contenedor padre */
  overflow: hidden;
  transition: all 0.3s ease-in-out; /* Transición suave para ocultar/mostrar */
}

/* Barra de búsqueda */
.search-bar {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px; /* Bordes más redondeados */
  box-sizing: border-box; /* Incluir padding en el ancho */
  font-size: 14px;
}

/* Lista de contactos */
.contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 10px; /* Ajuste de padding */
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  border-bottom: 1px solid #eee; /* Separador entre contactos */
}

.contact-item:last-child {
  border-bottom: none; /* Eliminar borde del último item */
}

.contact-item:hover {
  background: #f0f2f5; /* Color de hover más suave */
}

.contact-item.active {
  background: #e6f7ff;
  border-left: 4px solid #007bff; /* Indicador de selección */
  padding-left: 6px; /* Ajuste para el borde */
}

/* Avatar e indicador de online */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0; /* Evita que el avatar se encoja */
}

.avatar {
  width: 48px; /* Tamaño un poco más grande */
  height: 48px;
  border-radius: 50%;
  object-fit: cover; /* Asegura que la imagen no se distorsione */
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #4CAF50; /* Verde online */
  border-radius: 50%;
  border: 2px solid white; /* Borde blanco para visibilidad */
}

/* Información del contacto */
.contact-info {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column; /* Apila nombre y último mensaje */
  justify-content: center;
  overflow: hidden; /* Oculta el texto que se desborda */
}

.contact-name {
  margin: 0;
  font-size: 15px; /* Tamaño de fuente ligeramente más grande */
  font-weight: 600; /* Más negrita */
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Puntos suspensivos para texto largo */
}

.unread-badge {
  background: #f44336;
  color: white;
  font-size: 11px; /* Tamaño más pequeño */
  padding: 3px 7px;
  border-radius: 12px; /* Más redondeado */
  margin-top: 4px; /* Espacio entre nombre y badge */
  align-self: flex-end; /* Alinea a la derecha del info */
}

/* ---------------------- Chat Area ---------------------- */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Eliminamos los border-radius individuales, se manejará por el contenedor padre */
  overflow: hidden;
  background: #fbfbfb; /* Fondo ligeramente diferente */
  transition: all 0.3s ease-in-out; /* Transición suave para ocultar/mostrar */
}

/* Header del chat */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  background: #ffffff; /* Fondo blanco */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra sutil */
  flex-shrink: 0; /* Evita que el header se encoja */
}

.header-left {
  display: flex;
  align-items: center;
}

/* Botón de regresar */
.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back svg {
  width: 24px;
  height: 24px;
}

.header-avatar {
  width: 45px; /* Tamaño ligeramente más grande */
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.header-status {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.header-actions .dot-menu {
  font-size: 24px; /* Tamaño del icono */
  color: #666;
  cursor: pointer;
}

/* Contenedor de mensajes */
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: scroll;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  /* Para que los mensajes aparezcan desde abajo */
  min-height: 0; /* Importante para flexbox */
}

/* Mensaje si no hay mensajes */
.no-messages, .no-messages-selected {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
}


/* Burbuja de mensaje */
.message-bubble {
  max-width: 75%; /* Aumenta el ancho máximo de la burbuja */
  margin-bottom: 12px; /* Más espacio entre burbujas */
  position: relative;
  padding: 10px 14px; /* Ajuste de padding */
  border-radius: 18px; /* Más redondeado */
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08); /* Sombra sutil en burbujas */
}

/* Mensaje propio (alineado a la derecha) */
.sent {
  background: linear-gradient(to right, #cef5d9, #c0edc8); /* Gradiente suave */
  margin-left: auto;
  border-bottom-right-radius: 4px; /* Un poco menos redondeado en la esquina inferior-derecha */
}

/* Mensaje recibido (alineado a la izquierda) */
.received {
  background: linear-gradient(to right, #ffffff, #f0f0f0); /* Gradiente suave */
  margin-right: auto;
  border-bottom-left-radius: 4px; /* Un poco menos redondeado en la esquina inferior-izquierda */
}

/* Contenido del mensaje */
.message-content {
  margin: 0;
  font-size: 15px; /* Tamaño de fuente ligeramente más grande */
  color: #333;
  line-height: 1.4; /* Espaciado entre líneas */
}

/* Hora del mensaje */
.message-time {
  display: block;
  font-size: 11px;
  color: #777; /* Color más oscuro */
  margin-top: 6px; /* Más espacio */
  text-align: right;
}

/* Input de nuevo mensaje */
.chat-input {
  display: flex;
  align-items: center;
  padding: 10px 15px; /* Ajuste de padding */
  border-top: 1px solid #ddd;
  background: #fff;
  flex-shrink: 0; /* Evita que el footer se encoja */
}

.chat-input input[type="text"] {
  flex: 1;
  border: 1px solid #e0e0e0; /* Color de borde más suave */
  border-radius: 25px; /* Más redondeado */
  padding: 10px 15px;
  font-size: 15px;
  margin: 0 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.chat-input input[type="text"]:focus {
  border-color: #007bff; /* Borde azul al enfocar */
}

.btn-attach,
.btn-send {
  background: none;
  border: none;
  font-size: 22px; /* Iconos más grandes */
  cursor: pointer;
  padding: 8px; /* Área de clic más grande */
  border-radius: 50%; /* Botones circulares */
  transition: background-color 0.2s ease;
}

.btn-attach {
  color: #777; /* Color más suave */
}

.btn-attach:hover {
  background-color: #f0f0f0;
}

.btn-send {
  color: #007bff;
}

.btn-send:hover {
  background-color: #e6f7ff;
}

/* Estilo para el input deshabilitado */
.chat-input-disabled {
  padding: 10px 15px;
  border-top: 1px solid #ddd;
  background: #f0f0f0;
  text-align: center;
}

.chat-input-disabled input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: #e9e9e9;
  color: #888;
  cursor: not-allowed;
  text-align: center;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #4a90e2; /* azul suave para icono archivo */
  display: flex;
  align-items: center;
}

.file-name {
  flex-grow: 1;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-download-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #4a90e2;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0; /* Evita que el botón se encoja */
}

.btn-download-icon:hover {
  background-color: #d0e3ff;
}

/* ---------------------- Media Queries ---------------------- */

@media (max-width: 768px) {
  .chat-container {
    width: 95vw; /* Ocupa casi todo el ancho en móvil */
    height: 90vh; /* Ocupa más altura */
    flex-direction: row; /* Mantener la dirección de fila para controlar el display */
    border-radius: 0; /* Sin bordes redondeados en móvil para ocupar toda la pantalla */
    box-shadow: none; /* Sin sombra en móvil */
  }

  .sidebar {
    width: 100%; /* Ocupa todo el ancho cuando está visible */
    border-right: none;
    border-radius: 0; /* Sin bordes redondeados */
  }

  .chat-area {

    width: 100%; /* Ocupa todo el ancho cuando está visible */
    border-radius: 16px; /* Sin bordes redondeados */
  }

  /* Clases para ocultar/mostrar elementos en móvil */
  .mobile-hidden {
    display: none; /* Oculta completamente el elemento */
  }

  /* Ajuste para el header en vista móvil */
  .chat-header .header-left {
    justify-content: flex-start; /* Alinea los elementos a la izquierda */
  }

  .btn-back {
    display: flex; /* Asegura que el botón de regresar se muestre en móvil */
  }
}

/* Estilos para pantallas muy pequeñas (ej. 320px) */
@media (max-width: 480px) {
  .chat-header {
    padding: 8px 10px;
  }

  .header-avatar {
    width: 40px;
    height: 40px;
  }

  .header-name {
    font-size: 16px;
  }

  .chat-input input[type="text"] {
    padding: 8px 12px;
    font-size: 14px;
  }

  .btn-attach,
  .btn-send {
    font-size: 20px;
    padding: 6px;
  }

  .message-bubble {
    max-width: 85%; /* Más espacio para mensajes en pantallas muy pequeñas */
    padding: 8px 12px;
    font-size: 13px;
  }

  .message-time {
    font-size: 10px;
  }

  .contact-item {
    padding: 10px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .contact-name {
    font-size: 14px;
  }
}
</style>
