/*jshint esversion:6*/
/*jshint asi:true*/

const colores_generados_maximos = 30
const colores_elegidos_maximos = 12

let color_span = document.querySelector('#color-span')

const btn_hex = document.getElementById('btn_hex')
const btn_toggle = document.getElementById('btn_toggle')
const btn_cerrar = document.getElementById('boton_cerrar_canvas')
const btn_guardar_paleta = document.getElementById('guardarpaleta')
const btn_exportar_paleta = document.getElementById('exportar')

let timer_cambiodecolor = null
let globalcolor = ''

let colores_generados = []
let colores_elegidos = []

function obtener_max_height_para_canvas(arr_colores, incremento_y) {
  let max_height = 0
  for (let xi = 0; xi < arr_colores.length; xi++) {
    max_height += incremento_y
  }

  return +max_height
}

function generar_imagen_de_colores_elegidos() {
  const capacanvas = document.getElementById('capa_canvas')

  capacanvas.style.display = 'block'

  const canvas = document.getElementById('salida_imagen')
  let y_inicial = 80
  const incremento_y = 50

  canvas.width = 360
  canvas.height =
    y_inicial +
    30 +
    obtener_max_height_para_canvas(colores_elegidos, incremento_y)

  const capacanvasmain = document.getElementById('capa_canvas_main')
  capacanvasmain.style.padding = '10px'

  const ctx = document.getElementById('salida_imagen').getContext('2d')

  ctx.font = `30px 'Cascadia Code'`
  const rectangle = new Path2D()
  rectangle.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.fill(rectangle)
  ctx.fillStyle = '#222'

  ctx.fillText(' 🎨 Tu paleta 🍭', 75, 50)
  // debugger

  for (let xi = 0; xi < colores_elegidos.length; xi++) {
    ctx.fillStyle = '#222222'
    const element = colores_elegidos[xi]
    ctx.fillText(element, 225, y_inicial + 35)
    const rectangle = new Path2D()
    rectangle.rect(15, y_inicial, 200, 50)
    ctx.fillStyle = element
    ctx.fill(rectangle)
    y_inicial += incremento_y
  }
}

/**
 * TODO: Configurar número de colores a generar y número listado
 */

/**
 * TODO: Exportar a json
 */

function cambiar_nombre_de_span(span, hex) {
  span.textContent = hex
  span.style.color = hex

  return span
}

function get_numero_aleatorio(maxnumber) {
  return Math.floor(Math.random() * maxnumber)
}

function gen_color_hexadecimal() {
  const colors_hex = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ]
  let el_color = '#'

  for (let xi = 0; xi < 6; xi++) {
    el_color += colors_hex[get_numero_aleatorio(colors_hex.length)]
  }

  return el_color
}

function agregar_a_colores_listados(arr_colores, color, maximo, prefijoclass) {
  let color_remover = false
  if (arr_colores.length >= maximo) color_remover = arr_colores.shift()

  if (color_remover) {
    const selector_de_elemento = color_remover.replace('#', '')
    destruir_caja_color(`.${prefijoclass}${selector_de_elemento}`)
  }

  const color_existe = arr_colores.filter((ar_color) => {
    return ar_color === color
  })

  if (color_existe.length > 0) return false

  arr_colores.push(color)

  return true
}

function destruir_caja_color(color) {
  const elemento = document.querySelector(`${color}`)
  elemento.remove()
}

function construir_caja_color(class_elemento, color) {
  let caja = document.createElement('div')
  caja.style.backgroundColor = color
  caja.dataset.color = color

  caja.ondblclick = colores_db_click
  caja.onclick = colores_elegidos_click
  if (class_elemento === 'scolor') {
    caja.onclick = colores_listados_click
    caja.ondblclick = () => {}
  }

  color = color.replace('#', '')
  caja.classList.add(class_elemento)
  caja.classList.add(`${class_elemento}${color}`)

  return caja
}

function agregar_a_lista_de_colores(id_html_element, class_colores, color) {
  const footer = document.getElementById(id_html_element)
  footer.append(construir_caja_color(class_colores, color))
}

function colores_listados_click(e) {
  e.preventDefault()

  const seagrego = agregar_a_colores_listados(
    colores_elegidos,
    this.dataset.color,
    colores_elegidos_maximos,
    'ecolor'
  )
  if (!seagrego) return false
  agregar_a_lista_de_colores('paleta-de-colores', 'ecolor', this.dataset.color)

  color_span = cambiar_nombre_de_span(color_span, this.dataset.color)
  document.body.style.backgroundColor = this.dataset.color
  e.preventDefault()
  return false
}

function colores_elegidos_click(e) {
  e.preventDefault()
  color_span = cambiar_nombre_de_span(color_span, this.dataset.color)
  document.body.style.backgroundColor = this.dataset.color
}

function colores_db_click(e) {
  e.preventDefault()

  const quieres_eliminar = confirm(
    `¿Vas a eliminar a este men? ${this.dataset.color} `
  )

  colores_elegidos = colores_elegidos.filter((el) => {
    return el !== this.dataset.color
  })

  if (quieres_eliminar) this.remove()
}

btn_hex.addEventListener('click', function (e) {
  e.preventDefault()
  let hexColor = gen_color_hexadecimal()
  globalcolor = hexColor
  document.body.style.backgroundColor = hexColor

  const seagrego = agregar_a_colores_listados(
    colores_generados,
    hexColor,
    colores_generados_maximos,
    'scolor'
  )
  if (!seagrego) return false

  agregar_a_lista_de_colores('contenidofooter', 'scolor', hexColor)
  color_span = cambiar_nombre_de_span(color_span, hexColor)
})

btn_hex.addEventListener('mouseenter', function () {
  btn_hex.style.backgroundColor = gen_color_hexadecimal()
  btn_hex.style.borderRadius = '1000px'
  timer_cambiodecolor = setInterval(() => {
    btn_hex.style.backgroundColor = gen_color_hexadecimal()
  }, 2000)
})

btn_hex.addEventListener('mouseleave', function () {
  clearInterval(timer_cambiodecolor)
  btn_hex.style.borderRadius = '5px'
  btn_hex.style.backgroundColor = 'white'
})

btn_toggle.addEventListener('click', function (e) {
  e.preventDefault()

  const container_hex = document.getElementById('container-hex')

  const class_blanco_y_negro = 'container-b-n'
  const class_negro_y_blanco = 'container-n-b'

  const se_hizo_toggle = container_hex.classList.toggle(class_negro_y_blanco)

  if (se_hizo_toggle) {
    container_hex.classList.remove(class_blanco_y_negro)
  } else {
    container_hex.classList.add(class_blanco_y_negro)
  }
  return false
})

btn_cerrar.addEventListener('click', function (e) {
  e.preventDefault()

  const capa_canvas = document.querySelector('#capa_canvas')

  capa_canvas.style.display = 'none'
})

btn_exportar_paleta.addEventListener('click', function (e) {
  e.preventDefault()

  if (colores_elegidos.length <= 0) {
    alert('Primero elige algún color 😅')

    if (colores_generados.length <= 0) {
      alert(
        'Si no sabes como, presiona el botón [Colorear] y luego da un click al color que prefieras. Simple. 😎'
      )
      alert('Para eliminar alguno, dale doble click. 🤫')
    }

    return false
  }

  generar_imagen_de_colores_elegidos()
})

btn_guardar_paleta.addEventListener('click', function (e) {
  e.preventDefault()

  const link = document.createElement('a')
  link.download = 'Paleta-' + new Date()
  link.href = document.getElementById('salida_imagen').toDataURL('image/png')
  link.click()
})
