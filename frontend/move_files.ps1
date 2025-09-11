Set-Location 'c:/Users/lualf/data_luis/Proyectos/Desarrollo Web y Aplicaciones/asopromas/frontend/src/pages'

Move-Item -Path 'About.tsx.new' -Destination 'About.tsx' -Force
Move-Item -Path 'Contact.tsx.new' -Destination 'Contact.tsx' -Force
Move-Item -Path 'Productos.tsx.new' -Destination 'Productos.tsx' -Force

Set-Location products
Move-Item -Path 'ChocolateBar.tsx.new' -Destination 'ChocolateBar.tsx' -Force
Move-Item -Path 'CocoaLiquor.tsx.new' -Destination 'CocoaLiquor.tsx' -Force
