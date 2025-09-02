   const API_BASE = 'https://apirestfulltaller.onrender.com/api';

        // Mostrar mensajes
        function showMessage(message, type = 'success') {
            const messageDiv = document.createElement('div');
            messageDiv.className = type;
            messageDiv.textContent = message;
            const content = document.querySelector('.content');
            content.insertBefore(messageDiv, content.firstChild);
            setTimeout(() => messageDiv.remove(), 5000);
        }

        // Petición API genérica
        async function apiRequest(endpoint, method = 'GET', data = null) {
            try {
                const config = {
                    method,
                    headers: { 'Content-Type': 'application/json' }
                };
                if (data) config.body = JSON.stringify(data);
                const response = await fetch(`${API_BASE}/${endpoint}`, config);
                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                return await response.json();
            } catch (error) {
                showMessage(`Error: ${error.message}`, 'error');
                throw error;
            }
        }

        // Crear tabla genérica
        function createTable(data, columns) {
            if (!data || data.length === 0) return '<p class="loading">No hay datos disponibles</p>';
            let html = '<table class="data-table"><thead><tr>';
            columns.forEach(col => html += `<th>${col.label}</th>`);
            html += '<th>Acciones</th></tr></thead><tbody>';
            data.forEach(item => {
                html += '<tr>';
                columns.forEach(col => html += `<td>${item[col.key] ?? ''}</td>`);
                html += `<td>
                    <button class="btn btn-danger" onclick="deleteItem('${columns[0].endpoint}', ${item[columns[0].key]})">🗑️ Eliminar</button>
                </td></tr>`;
            });
            html += '</tbody></table>';
            return html;
        }

        // Eliminar elemento
        window.deleteItem = async function(endpoint, id) {
            if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
                try {
                    await apiRequest(`${endpoint}/${id}`, 'DELETE');
                    showMessage('Elemento eliminado correctamente');
                    switch(endpoint) {
                        case 'Repuesto': loadRepuestos(); break;
                        case 'Cliente': loadClientes(); break;
                        case 'Servicio': loadServicios(); break;
                        case 'Maquina': loadMaquinas(); break;
                        case 'Reparacione': loadReparaciones(); break;
                        case 'DetalleReparacion': loadDetalleReparacion(); break;
                    }
                } catch {
                    showMessage('Error al eliminar el elemento', 'error');
                }
            }
        };

        // REPUESTOS
        async function loadRepuestos() {
            const container = document.getElementById('repuestos-data');
            container.innerHTML = '<div class="loading">Cargando repuestos...</div>';
            try {
                const data = await apiRequest('Repuesto');
                const columns = [
                    { key: 'idRepuesto', label: 'ID', endpoint: 'Repuesto' },
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'descripcion', label: 'Descripción' },
                    { key: 'precio', label: 'Precio' },
                    { key: 'stock', label: 'Stock' }
                ];
                container.innerHTML = createTable(data, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar repuestos</div>';
            }
        }
        document.getElementById('repuestoForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const repuesto = {
                nombre: document.getElementById('repuesto-nombre').value,
                descripcion: document.getElementById('repuesto-descripcion').value,
                precio: parseFloat(document.getElementById('repuesto-precio').value),
                stock: parseInt(document.getElementById('repuesto-stock').value)
            };
            try {
                if(await apiRequest('Repuesto/nombre/' + encodeURIComponent(repuesto.nombre)).length > 0) {
                    showMessage('Error: Ya existe un repuesto con ese nombre', 'error');
                    return; 
                }else{
                    await apiRequest('Repuesto', 'POST', repuesto);
                    showMessage('Repuesto agregado correctamente');
                    this.reset();
                    loadRepuestos();
                }
            } catch {}
        });

        // CLIENTES
        async function loadClientes() {
            const container = document.getElementById('clientes-data');
            container.innerHTML = '<div class="loading">Cargando clientes...</div>';
            try {
                const data = await apiRequest('Cliente');
                const columns = [
                    { key: 'idCliente', label: 'ID', endpoint: 'Cliente' },
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'apellido', label: 'Apellido' },
                    { key: 'email', label: 'Email' },
                    { key: 'telefono', label: 'Teléfono' },
                    { key: 'direccion', label: 'Dirección' }
                ];
                container.innerHTML = createTable(data, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar clientes</div>';
            }
        }
        document.getElementById('clienteForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const cliente = {
                nombre: document.getElementById('cliente-nombre').value,
                apellido: document.getElementById('cliente-apellido').value,
                email: document.getElementById('cliente-email').value,
                telefono: document.getElementById('cliente-telefono').value,
                direccion: document.getElementById('cliente-direccion').value
            };
            try {
                await apiRequest('Cliente', 'POST', cliente);
                showMessage('Cliente agregado correctamente');
                this.reset();
                loadClientes();
            } catch {}
        });

        // SERVICIOS
        async function loadServicios() {
            const container = document.getElementById('servicios-data');
            container.innerHTML = '<div class="loading">Cargando servicios...</div>';
            try {
                const data = await apiRequest('Servicio');
                const columns = [
                    { key: 'idServicio', label: 'ID', endpoint: 'Servicio' },
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'precioBase', label: 'Precio' },
                    { key: 'descripcion', label: 'Descripción' }
                ];
                container.innerHTML = createTable(data, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar servicios</div>';
            }
        }
        document.getElementById('servicioForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const servicio = {
                nombre: document.getElementById('servicio-nombre').value,
                precioBase: parseFloat(document.getElementById('servicio-precio').value),
                descripcion: document.getElementById('servicio-descripcion').value
            };
            try {
                await apiRequest('Servicio', 'POST', servicio);
                showMessage('Servicio agregado correctamente');
                this.reset();
                loadServicios();
            } catch {}
        });

        // MÁQUINAS
        async function loadMaquinas() {
            const container = document.getElementById('maquinas-data');
            container.innerHTML = '<div class="loading">Cargando máquinas...</div>';
            try {
                const data = await apiRequest('Maquina');
                const columns = [
                    { key: 'id', label: 'ID', endpoint: 'Maquina' },
                    { key: 'nombre', label: 'Nombre/Modelo' },
                    { key: 'marca', label: 'Marca' },
                    { key: 'año', label: 'Año' },
                    { key: 'numeroSerie', label: 'N° Serie' }
                ];
                container.innerHTML = createTable(data, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar máquinas</div>';
            }
        }
        document.getElementById('maquinaForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const maquina = {
                nombre: document.getElementById('maquina-nombre').value,
                marca: document.getElementById('maquina-marca').value,
                año: parseInt(document.getElementById('maquina-año').value),
                numeroSerie: document.getElementById('maquina-serie').value
            };
            try {
                // Validar que no exista una máquina con el mismo número de serie
                const existentes = await apiRequest('Maquina/numeroSerie/' + encodeURIComponent(maquina.numeroSerie));
                if (existentes && existentes.length > 0) {
                    showMessage('Error: Ya existe una máquina con ese número de serie', 'error');
                    return;
                }
                await apiRequest('Maquina', 'POST', maquina);
                showMessage('Máquina agregada correctamente');
                this.reset();
                loadMaquinas();
            } catch {}
        });

        // Cargar combos para Reparaciones
        async function cargarComboMaquinas() {
            const select = document.getElementById('reparacion-maquina');
            select.innerHTML = '<option value="">Seleccione una máquina</option>';
            try {
                const maquinas = await apiRequest('Maquina');
                maquinas.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.id;
                    option.textContent = `${m.nombre} (${m.marca || ''})`;
                    select.appendChild(option);
                });
            } catch {
                select.innerHTML = '<option value="">Error al cargar máquinas</option>';
            }
        }
        async function cargarComboServicios() {
            const select = document.getElementById('reparacion-servicios');
            select.innerHTML = '';
            try {
                const servicios = await apiRequest('Servicio');
                servicios.forEach(s => {
                    const option = document.createElement('option');
                    option.value = s.idServicio;
                    option.textContent = `${s.nombre} ($${s.precioBase})`;
                    select.appendChild(option);
                });
            } catch {
                select.innerHTML = '<option value="">Error al cargar servicios</option>';
            }
        }
        async function cargarComboRepuestos() {
            const select = document.getElementById('reparacion-repuestos');
            select.innerHTML = '';
            try {
                const repuestos = await apiRequest('Repuesto');
                repuestos.forEach(r => {
                    const option = document.createElement('option');
                    option.value = r.idRepuesto;
                    option.textContent = `${r.nombre} ($${r.precio})`;
                    select.appendChild(option);
                });
            } catch {
                select.innerHTML = '<option value="">Error al cargar repuestos</option>';
            }
        }

        // REPARACIONES
        async function loadReparaciones() {
            const container = document.getElementById('reparaciones-data');
            container.innerHTML = '<div class="loading">Cargando reparaciones...</div>';
            try {
                const data = await apiRequest('Reparacione');
                const columns = [
                    { key: 'idReparacion', label: 'ID', endpoint: 'Reparacione' },
                    { key: 'idMaquina', label: 'ID Máquina' },
                    { key: 'fechaIngreso', label: 'Fecha Ingreso' },
                    { key: 'fechaSalida', label: 'Fecha Finalización' },
                    { key: 'estado', label: 'Estado' },
                    { key: 'observaciones', label: 'Observaciones' }
                ];
                // Formatear fechas
                const formattedData = data.map(item => ({
                    ...item,
                    fechaIngreso: item.fechaIngreso ? new Date(item.fechaIngreso).toLocaleString() : '',
                    fechaSalida: item.fechaSalida ? new Date(item.fechaSalida).toLocaleString() : ''
                }));
                container.innerHTML = createTable(formattedData, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar reparaciones</div>';
            }
        }
        document.getElementById('reparacionForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const idMaquina = parseInt(document.getElementById('reparacion-maquina').value);
            const fechaIngreso = document.getElementById('reparacion-fecha-ingreso').value;
            const fechaSalida = document.getElementById('reparacion-fecha-salida').value || null;
            const estado = document.getElementById('reparacion-estado').value;
            const observaciones = document.getElementById('reparacion-observaciones').value;
            // Servicios y repuestos seleccionados
            const servicios = Array.from(document.getElementById('reparacion-servicios').selectedOptions).map(opt => parseInt(opt.value));
            const repuestos = Array.from(document.getElementById('reparacion-repuestos').selectedOptions).map(opt => parseInt(opt.value));
            try {
                // 1. Crear la reparación
                const reparacion = { idMaquina, fechaIngreso, fechaSalida, estado, observaciones };
                const nuevaReparacion = await apiRequest('Reparacione', 'POST', reparacion);
                const idReparacion = nuevaReparacion.idReparacion || nuevaReparacion.id || nuevaReparacion.IdReparacion;
                // 2. Crear los detalles de reparación para cada combinación servicio/repuesto
                // Si no hay servicios ni repuestos, no se crea detalle
                if (servicios.length === 0 && repuestos.length === 0) {
                    showMessage('Reparación agregada correctamente (sin detalles)');
                } else {
                    // Si hay servicios y repuestos, se crea un detalle por cada combinación
                    if (servicios.length > 0 && repuestos.length > 0) {
                        for (let idServicio of servicios) {
                            for (let idRepuesto of repuestos) {
                                // Buscar precio unitario del repuesto
                                let repuestoData = await apiRequest('Repuesto/' + idRepuesto);
                                let precioUnitario = repuestoData.precio || 0;
                                await apiRequest('DetalleReparacion', 'POST', {
                                    idReparacion,
                                    idServicio,
                                    idRepuesto,
                                    cantidad: 1,
                                    precioUnitario
                                });
                            }
                        }
                    } else if (servicios.length > 0) {
                        // Solo servicios
                        for (let idServicio of servicios) {
                            let servicioData = await apiRequest('Servicio/' + idServicio);
                            let precioUnitario = servicioData.precioBase || 0;
                            await apiRequest('DetalleReparacion', 'POST', {
                                idReparacion,
                                idServicio,
                                idRepuesto: null,
                                cantidad: 1,
                                precioUnitario
                            });
                        }
                    } else if (repuestos.length > 0) {
                        // Solo repuestos
                        for (let idRepuesto of repuestos) {
                            let repuestoData = await apiRequest('Repuesto/' + idRepuesto);
                            let precioUnitario = repuestoData.precio || 0;
                            await apiRequest('DetalleReparacion', 'POST', {
                                idReparacion,
                                idServicio: null,
                                idRepuesto,
                                cantidad: 1,
                                precioUnitario
                            });
                        }
                    }
                    showMessage('Reparación y detalles agregados correctamente');
                }
                this.reset();
                loadReparaciones();
            } catch (err) {}
        });   // DETALLE REPARACION
        async function loadDetalleReparacion() {
            const container = document.getElementById('detalle-reparacion-data');
            container.innerHTML = '<div class="loading">Cargando detalles de reparación...</div>';
            try {
                const data = await apiRequest('DetalleReparacion');
                const columns = [
                    { key: 'idDetalle', label: 'ID', endpoint: 'DetalleReparacion' },
                    { key: 'idReparacion', label: 'ID Reparación' },
                    { key: 'idServicio', label: 'ID Servicio' },
                    { key: 'idRepuesto', label: 'ID Repuesto' },
                    { key: 'cantidad', label: 'Cantidad' },
                    { key: 'precioUnitario', label: 'Precio Unitario' }
                ];
                container.innerHTML = createTable(data, columns);
            } catch {
                container.innerHTML = '<div class="error">Error al cargar detalles de reparación</div>';
            }
        }

        // Cambiar de sección y cargar datos automáticamente
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                const sectionName = this.getAttribute('data-section');
                document.getElementById(sectionName).classList.add('active');
                this.classList.add('active');
                // Cargar datos según la sección
                switch(sectionName) {
                    case 'repuestos': loadRepuestos(); break;
                    case 'clientes': loadClientes(); break;
                    case 'servicios': loadServicios(); break;
                    case 'maquinas': loadMaquinas(); break;
                    case 'reparaciones':
                        await cargarComboMaquinas();
                        await cargarComboServicios();
                        await cargarComboRepuestos();
                        loadReparaciones();
                        break;
                    case 'detalle-reparacion':
                        loadDetalleReparacion();
                        break;
                }
            });
        });

        // Botones de recarga manual
        document.getElementById('btn-cargar-repuestos').onclick = loadRepuestos;
        document.getElementById('btn-cargar-clientes').onclick = loadClientes;
        document.getElementById('btn-cargar-servicios').onclick = loadServicios;
        document.getElementById('btn-cargar-maquinas').onclick = loadMaquinas;
        document.getElementById('btn-cargar-reparaciones').onclick = function() {
            cargarComboMaquinas();
            cargarComboServicios();
            cargarComboRepuestos();
            loadReparaciones();
        };
        document.getElementById('btn-cargar-detalle-reparacion').onclick = loadDetalleReparacion;

        // Cargar datos iniciales
        window.addEventListener('load', function() {
            loadRepuestos();
        });