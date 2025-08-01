/**
 * Script de instalación automática para PWA
 * Cartilla de Emergencia UNAV
 */

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.installButton = null;
        this.statusCallback = null;
        
        this.init();
    }
    
    init() {
        // Detectar eventos de instalación
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA puede ser instalada');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA instalada exitosamente');
            this.isInstalled = true;
            this.onInstallSuccess();
        });
        
        // Registrar Service Worker
        this.registerServiceWorker();
        
        // Verificar si ya está instalada
        this.checkIfInstalled();
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('install/sw.js');
                console.log('✅ Service Worker registrado:', registration);
                
                // Manejar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
                
            } catch (error) {
                console.error('❌ Error registrando Service Worker:', error);
            }
        }
    }
    
    checkIfInstalled() {
        // Verificar si está ejecutándose como PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone || 
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            this.isInstalled = true;
            this.onAlreadyInstalled();
        }
    }
    
    async install() {
        if (!this.deferredPrompt) {
            this.showManualInstructions();
            return false;
        }
        
        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ Usuario aceptó la instalación');
                this.onInstallSuccess();
                return true;
            } else {
                console.log('❌ Usuario rechazó la instalación');
                this.showManualInstructions();
                return false;
            }
        } catch (error) {
            console.error('❌ Error durante la instalación:', error);
            this.showManualInstructions();
            return false;
        } finally {
            this.deferredPrompt = null;
        }
    }
    
    showInstallPrompt() {
        // Mostrar botón de instalación personalizado
        this.createInstallButton();
        
        // Callback para UI personalizada
        if (this.statusCallback) {
            this.statusCallback('installable', {
                canInstall: true,
                isInstalled: false
            });
        }
    }
    
    createInstallButton() {
        // Solo crear si no existe
        if (this.installButton) return;
        
        this.installButton = document.createElement('button');
        this.installButton.id = 'pwa-install-button';
        this.installButton.className = 'btn btn-primary pwa-install-btn';
        this.installButton.innerHTML = `
            <i class="bi bi-download me-2"></i>
            Instalar Aplicación
        `;
        
        this.installButton.addEventListener('click', () => {
            this.install();
        });
        
        // Estilos
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                border-radius: 50px;
                padding: 12px 20px;
                box-shadow: 0 4px 20px rgba(35, 35, 108, 0.3);
                animation: pwa-pulse 2s infinite;
            }
            
            @keyframes pwa-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .pwa-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(35, 35, 108, 0.4);
            }
            
            @media (max-width: 768px) {
                .pwa-install-btn {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    width: auto;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.installButton);
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.remove();
            this.installButton = null;
        }
    }
    
    onInstallSuccess() {
        this.hideInstallButton();
        this.showSuccessMessage();
        
        if (this.statusCallback) {
            this.statusCallback('installed', {
                canInstall: false,
                isInstalled: true
            });
        }
    }
    
    onAlreadyInstalled() {
        if (this.statusCallback) {
            this.statusCallback('already-installed', {
                canInstall: false,
                isInstalled: true
            });
        }
    }
    
    showSuccessMessage() {
        this.showNotification(
            '✅ ¡Aplicación instalada!',
            'La aplicación se ha instalado correctamente en tu dispositivo.',
            'success'
        );
    }
    
    showManualInstructions() {
        const platform = this.detectPlatform();
        let message = '';
        
        if (platform === 'ios') {
            message = 'Para instalar en iOS: Safari → Compartir → "Agregar a pantalla de inicio"';
        } else if (platform === 'android') {
            message = 'Para instalar en Android: Menú (⋮) → "Instalar aplicación"';
        } else {
            message = 'Guarda esta página como marcador para acceso rápido';
        }
        
        this.showNotification(
            '📱 Instalación manual',
            message,
            'info'
        );
    }
    
    showUpdateAvailable() {
        this.showNotification(
            '🔄 Actualización disponible',
            'Hay una nueva versión disponible. Recarga la página para actualizar.',
            'warning',
            () => window.location.reload()
        );
    }
    
    showNotification(title, message, type = 'info', action = null) {
        // Crear notificación personalizada
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <div class="pwa-notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
                ${action ? '<button class="btn btn-sm btn-light mt-2">Actualizar</button>' : ''}
                <button class="pwa-notification-close">&times;</button>
            </div>
        `;
        
        // Estilos para la notificación
        if (!document.querySelector('#pwa-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'pwa-notification-styles';
            style.textContent = `
                .pwa-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 350px;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: pwa-slide-in 0.3s ease;
                }
                
                .pwa-notification-success {
                    background: #d1edff;
                    border-left: 4px solid #0dcaf0;
                    color: #055160;
                }
                
                .pwa-notification-info {
                    background: #e7f3ff;
                    border-left: 4px solid #0d6efd;
                    color: #084298;
                }
                
                .pwa-notification-warning {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    color: #664d03;
                }
                
                .pwa-notification-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    opacity: 0.7;
                }
                
                .pwa-notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes pwa-slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .pwa-notification {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Event listeners
        notification.querySelector('.pwa-notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        if (action) {
            notification.querySelector('.btn').addEventListener('click', action);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/iphone|ipad|ipod/.test(userAgent)) {
            return 'ios';
        } else if (/android/.test(userAgent)) {
            return 'android';
        } else if (/windows/.test(userAgent)) {
            return 'windows';
        } else if (/mac/.test(userAgent)) {
            return 'mac';
        } else {
            return 'unknown';
        }
    }
    
    // API pública
    onStatusChange(callback) {
        this.statusCallback = callback;
    }
    
    getStatus() {
        return {
            canInstall: !!this.deferredPrompt,
            isInstalled: this.isInstalled,
            platform: this.detectPlatform()
        };
    }
    
    forceInstall() {
        return this.install();
    }
}

// Inicializar automáticamente cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller();
});

// Exportar para uso manual
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAInstaller;
}