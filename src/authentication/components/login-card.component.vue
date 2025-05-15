<script>
      export default {
        name: 'LoginCard',
        props: {
          errorMessage: {
            type: String,
            default: ''
          }
        },
        data() {
          return {
            Mail: '',
            Password: '',
            captchaVerified: false,
            errors: {
              Mail: '',
              Password: ''
            }
          };
        },
        methods: {
          validateFields() {
            let isValid = true;

            if (!this.Mail) {
              this.errors.Mail = 'El correo es obligatorio.';
              isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.Mail)) {
              this.errors.Mail = 'El correo no es válido.';
              isValid = false;
            } else {
              this.errors.Mail = '';
            }

            if (!this.Password) {
              this.errors.Password = 'La contraseña es obligatoria.';
              isValid = false;
            } else if (this.Password.length < 8) {
              this.errors.Password = 'La contraseña debe tener al menos 8 caracteres.';
              isValid = false;
            } else {
              this.errors.Password = '';
            }

            if (!this.captchaVerified) {
              alert('Por favor, completa el CAPTCHA.');
              isValid = false;
            }

            return isValid;
          },
          onCaptchaSuccess(token) {
            this.captchaVerified = true;
            // Usar token para validar en el back para el prox sprint
          },
          login() {
            if (this.validateFields()) {
              this.$emit('login', { Mail: this.Mail, Password: this.Password });
            }
          }
        }
      };
      </script>

      <template>

        <div class="bg-white">
          <br>
          <div class="mx-3 bg-white">
            <i class="pi pi-chevron-left text-purple-500" style="font-size: 2rem"></i>
          </div>

          <div class="flex justify-content-center align-items-center text-center" style="height: 80vh;">
            <pv-card aria-label="Login Form" class="flex border-card shadow-4 px-6">
              <template #title>
                <div>
                  <img src="../../assets/logo.png" alt="Webmaster's logo" width="210" class="-m-2">
                </div>
              </template>
              <template #content>
                <div class="flex flex-column gap-3 align-items-center">
                  <div class="flex flex-column gap-4">
                    <pv-inputText
                        aria-label="User input field"
                        type="text"
                        v-model="Mail"
                        placeholder="Correo"
                        class="border-round-3xl"
                        @keyup.enter="login"
                    />
                    <p v-if="errors.Mail" class="text-red-500 text-sm">{{ errors.Mail }}</p>

                    <pv-password
                        aria-label="Password input field"
                        v-model="Password"
                        :feedback="false"
                        placeholder="Contraseña"
                        class="border-round-3xl"
                        @keyup.enter="login"
                    />
                    <p v-if="errors.Password" class="text-red-500 text-sm">{{ errors.Password }}</p>
                  </div>

                  <!-- hCaptcha -->
                  <div class="h-captcha" data-sitekey="0c882c5c-e8c8-4d82-b9dc-5adcddbaa1fe" data-callback="onCaptchaSuccess"></div>

                  <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
                  <pv-button
                      aria-label="Login button"
                      label="Iniciar sesion"
                      class="border-round-xl w-10rem bg-blue-600 text-lg"
                      @click="login"
                  />
                </div>
                <div class="color-auth font-bold">
                  <p>
                    <router-link aria-label="Go to password recovery" to="/password-recovery" class="text-purple-500 text-sm">
                      ¿Olvidaste tu contraseña?
                    </router-link>
                  </p>
                  <p class="-mt-1">
                    <router-link aria-label="Go to registration page" to="/register" class="text-purple-500 text-sm">Crear
                      cuenta
                    </router-link>
                  </p>
                </div>
              </template>
            </pv-card>
          </div>
        </div>
      </template>

      <style scoped>
      .p-button {
        border: 0;
      }

      .color-auth {
        color: #38B397;
      }

      .border-card {
        border: 2px solid #333333;
        border-radius: 5rem;
      }

      :deep(body) {
        background-color: #F5F5F5 !important;
      }

      :deep(.p-inputtext) {
        border-radius: 1.5rem !important;
      }
      </style>