

<script>
import messengerService from "../../../public/services/messenger.service.js"

export default {
  name: "chat-component",
  data() {
    return {
      // Mensajes del contacto seleccionado actualmente
      currentMessages: [],

      // Para filtrar contactos si se desea
      searchQuery: "",

      // Lista de contactos
      contacts: [],

      // Id del contacto actualmente seleccionado
      selectedContactId: null, // Inicialmente null, hasta que se cargue el primer contacto

      // Mensaje que estamos escribiendo
      newMessage: "",
    };
  },
  computed: {
    // Contacto seleccionado como objeto
    currentContact() {
      return this.contacts.find((c) => c.id === this.selectedContactId);
    },

    // Filtrar contactos a partir de searchQuery
    filteredContacts() {
      if (!this.searchQuery) return this.contacts;
      return this.contacts.filter((c) =>
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async downloadFile(message) {
      try {
        if (!message.fileUrl) {
          alert("No se encontró la URL del archivo para descargar.");
          return;
        }
        const fileData = await messengerService.getFileByUrl(message.fileUrl); // Llama a tu nueva función

        const link = document.createElement('a');
        link.href = fileData.fileContent;
        link.download = fileData.fileName || 'archivo';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        alert("Error al descargar el archivo.");
        console.error(error);
      }
    },
    async sendFileMessage(file) {
      if (!file || !this.currentContact) return;

      const senderId = parseInt(localStorage.getItem('user id'));
      const recipientId = this.currentContact.userId;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("senderId", senderId);
      formData.append("recipientId", recipientId);
      formData.append("emailBody", `El usuario ha enviado un archivo: ${file.name}`);

      try {
        const result = await messengerService.sendFileMessage({
          senderId,
          recipientId,
          file
        });
        console.log("Archivo enviado correctamente:", result);

        // Agrega el mensaje localmente
        const now = new Date();
        this.currentMessages.push({
          id: result.id || Date.now(),
          content: '', // Opcional, o dejar vacío si tienes fileName
          time: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          isMine: true,
          isFile: true,
          fileName: file.name,
          fileUrl: result.fileUrl || '#',  // La URL real donde se puede descargar el archivo
        });

        this.$nextTick(() => {
          this.scrollToBottom();
        });

      } catch (error) {
        console.error("Error al enviar el archivo:", error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click(); // Simula el clic sobre el input[type=file] oculto
    },
    handleFileSelection(event) {
      console.log('test upload');
      const file = event.target.files[0];
      if (file) {
        console.log("Archivo seleccionado:", file);
        this.sendFileMessage(file);
      }
    },
    async prepareAndSendMessage() {
      const text = this.newMessage.trim();
      if (!text || !this.currentContact) return; // No enviar si no hay texto o contacto seleccionado

      const senderId = parseInt(localStorage.getItem('user id'));
      const recipient = this.currentContact; // Ya tenemos el contacto seleccionado

      const messagePayload = {
        subject: "string", // Ajusta si tu API espera un asunto real
        emailBody: text,
        recipientId: recipient.userId,
        senderId: senderId
      };

      console.log("Mensaje a enviar:", messagePayload);

      try {
        const result = await messengerService.sendMessage(messagePayload);
        console.log('Mensaje enviado con éxito:', result);

        // Agrega el mensaje a la vista localmente
        const now = new Date();
        this.currentMessages.push({
          id: result.id || Date.now(), // Usa el ID real del mensaje si lo devuelve la API
          content: text,
          time: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          isMine: true,
        });

        this.newMessage = ""; // Limpia el input
        this.$nextTick(() => {
          this.scrollToBottom(); // Desplázate al fondo
        });

      } catch (error) {
        console.error('Error enviando mensaje:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    },
    async selectContact(id) {
      this.selectedContactId = id;
      let contact = this.contacts.find(c => c.id === id);

      let senderId = parseInt(localStorage.getItem('user id'));
      let recipientId = contact.userId; // Asume que cada contacto tiene un userId

      try {
        let messages = await messengerService.getMessagesByUsers(senderId, recipientId);

        if (messages && messages.length > 0) {
          this.currentMessages = messages.map((msg, index) => ({
            id: msg.id || index + 1,
            content: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            isMine: msg.senderId === senderId,
            isFile: !!msg.fileUrl, // si tiene URL, es archivo
            fileName: msg.fileName || msg.content || 'archivo',
            fileUrl: msg.fileUrl || '',
          }));
          console.log("Mensajes recibidos del backend:", messages);
        } else {
          this.currentMessages = []; // Limpiar la vista de mensajes si no hay ninguno
        }
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
        this.currentMessages = []; // Asegúrate de limpiar en caso de error también
      }

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    async loadContacts() {
      const userType = localStorage.getItem('user type');
      const contacts = await messengerService.getUsersFilteredByUserType(userType);

      this.contacts = contacts.map((c) => ({
        ...c
      }));

      // Si hay contactos, seleccionamos el primero y cargamos sus mensajes
      if (this.contacts.length > 0) {
        // Establecer el ID del primer contacto
        this.selectedContactId = this.contacts[0].id;
        // Llamar a selectContact para cargar sus mensajes
        await this.selectContact(this.contacts[0].id);
      }
    }
  },
  async mounted() {
    // Al montar el componente, cargamos los contactos
    await this.loadContacts();
    // scrollToBottom ya se llama dentro de selectContact, así que no es necesario aquí de nuevo
  },
};
</script>

<template>
  <div class="chat-container">
    <aside class="sidebar">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Busca conversaciones..."/>
      </div>
      <ul class="contact-list">
        <li
            v-for="contact in filteredContacts"
            :key="contact.id"
            :class="['contact-item', { active: contact.id === selectedContactId }]"
            @click="selectContact(contact.id)"
        >
          <div class="avatar-wrapper">
            <img :src="contact.avatar" class="avatar" alt="Avatar"/>
            <span v-if="contact.online" class="online-indicator"></span>
          </div>
          <div class="contact-info">
            <p class="contact-name">{{ contact.name }}</p>
            <span
                v-if="contact.unreadCount > 0"
                class="unread-badge"
            >{{ contact.unreadCount }}</span>
          </div>
        </li>
      </ul>
    </aside>

    <section class="chat-area">
      <header class="chat-header" v-if="currentContact">
        <div class="header-left">
          <img :src="currentContact.avatar" class="header-avatar" alt="Avatar"/>
          <div class="header-info">
            <p class="header-name">{{ currentContact.name }}</p>
            <p class="header-status" v-if="currentContact.online">En línea</p>
          </div>
        </div>
        <div class="header-actions">
          <span class="dot-menu">⋮</span>
        </div>
      </header>
      <header class="chat-header" v-else>
        <div class="header-left">
          <p class="header-name">Selecciona un contacto para chatear</p>
        </div>
      </header>

      <div class="chat-messages" ref="messageContainer">
        <div
            v-for="message in currentMessages"
            :key="message.id"
            :class="['message-bubble', message.isMine ? 'sent' : 'received']"
        >
          <p class="message-content">
            <template v-if="message.isFile">
    <span class="file-icon" aria-label="Archivo" title="Archivo">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" fill="none"
        stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-file"
    >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
    </span>
              <span class="file-name">{{ message.fileName }}</span>
              <button class="btn-download-icon" @click="downloadFile(message)" aria-label="Descargar archivo"
                      title="Descargar">
                <!-- Icono de descarga -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path
                      d="M.5 9.9v3.6A1.5 1.5 0 0 0 2 15h12a1.5 1.5 0 0 0 1.5-1.5v-3.6a.5.5 0 0 0-1 0v3.6a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-3.6a.5.5 0 0 0-1 0z"/>
                  <path
                      d="M7.5 1.5v7.793l-2.146-2.147-.708.707L8 11.207l3.354-3.354-.708-.707L8.5 9.293V1.5a.5.5 0 0 0-1 0z"/>
                </svg>
              </button>
            </template>
            <template v-else>
              {{ message.content }}
            </template>
          </p>


          <span class="message-time">{{ message.time }}</span>
        </div>


        <div v-if="currentMessages.length === 0 && currentContact" class="no-messages">
          ¡Aún no hay mensajes en esta conversación! Sé el primero en decir hola.
        </div>
        <div v-if="!currentContact" class="no-messages-selected">
          Selecciona un contacto para iniciar una conversación.
        </div>
      </div>

      <footer class="chat-input" v-if="currentContact">
        <!-- Botón clip con input oculto -->
        <button class="btn-attach" @click="triggerFileInput">📎</button>
        <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileSelection"
        />

        <input
            type="text"
            v-model="newMessage"
            placeholder="Escribe un mensaje..."
            @keyup.enter="prepareAndSendMessage"
        />
        <button class="btn-send" @click="prepareAndSendMessage">
          ➤
        </button>
      </footer>
      <footer class="chat-input-disabled" v-else>
        <input type="text" placeholder="Selecciona un contacto para enviar mensajes..." disabled/>
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
}

/* ---------------------- Sidebar ---------------------- */
.sidebar {
  width: 280px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  overflow: hidden;

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
  border-radius: 4px;
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
  padding: 10px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.contact-item:hover {
  background: #f5f5f5;
}

.contact-item.active {
  background: #e6f7ff;
}

/* Avatar e indicador de online */
.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}


/* Información del contacto */
.contact-info {
  flex: 1;
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.unread-badge {
  background: #f44336;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* ---------------------- Chat Area ---------------------- */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  overflow: hidden;

}

/* Header del chat */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.header-info {
  margin-left: 10px;
}

.header-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-status {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.header-actions .dot-menu {
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

/* Contenedor de mensajes */
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fafafa;
}

/* Burbuja de mensaje */
.message-bubble {
  max-width: 60%;
  margin-bottom: 10px;
  position: relative;
  padding: 10px 12px;
  border-radius: 8px;
  word-wrap: break-word;
}

/* Mensaje propio (alineado a la derecha) */
.sent {
  background: #cef5d9;
  margin-left: auto;
  border-bottom-right-radius: 0;
}

/* Mensaje recibido (alineado a la izquierda) */
.received {
  background: white;
  margin-right: auto;
  border-bottom-left-radius: 0;
}

/* Contenido del mensaje */
.message-content {
  margin: 0;
  font-size: 14px;
  color: #333;
}

/* Hora del mensaje */
.message-time {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

/* Input de nuevo mensaje */
.chat-input {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #ddd;
  background: #fff;
}

.chat-input input[type="text"] {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 14px;
  margin: 0 8px;
  outline: none;
}

.btn-attach,
.btn-send {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.btn-attach {
  color: #555;
}

.btn-send {
  color: #007bff;
}

.btn-download {
  margin-left: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-download:hover {
  background-color: #0056b3;
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
}

.btn-download-icon:hover {
  background-color: #d0e3ff;
}


</style>
