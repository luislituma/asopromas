import { type FC } from 'react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6 text-brown-600" />,
            title: "Correo",
            details: "info@asopromas.com",
            link: "mailto:info@asopromas.com"
        },
        {
            icon: <Phone className="h-6 w-6 text-brown-600" />,
            title: "Teléfono",
            details: "+593 (07) 2605-120",
            link: "tel:+59372605120"
        },
        {
            icon: <MapPin className="h-6 w-6 text-brown-600" />,
            title: "Ubicación",
            details: "Zamora Chinchipe, Ecuador",
            link: "https://maps.app.goo.gl/vBXruvC58KCSA6xcA"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                    Contáctanos
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    ¿Tienes preguntas sobre nuestros productos o te interesa conocernos mejor?
                    Nos encantaría saber de ti.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">                    
                    <div className="bg-white border rounded-2xl shadow-lg p-8 space-y-8">
                        <h2 className="text-lg font-medium text-amber-800">Nuestra Información</h2>
                        {contactInfo.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                                target={item.title === "Ubicación" ? "_blank" : undefined}
                                rel={item.title === "Ubicación" ? "noopener noreferrer" : undefined}
                            >
                                <div className="flex-shrink-0 rounded-full p-3 bg-brown-50 group-hover:bg-brown-100 transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600 group-hover:text-brown-600 transition-colors">
                                        {item.details}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Map or Image */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 aspect-video">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3980.6888951769893!2d-78.7628945!3d-3.8767307!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cb7125e067b73b%3A0xbd0a79847abc365e!2sAsopromas!5e0!3m2!1ses-419!2sec!4v1757081790631!5m2!1ses-419!2sec"
                            className="w-full h-full rounded-xl"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="ASOPROMAS Location"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white border rounded-2xl shadow-xl p-8 flex flex-col">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-lg font-medium text-amber-800">Envíanos un mensaje</h2>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 px-4 py-2"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 px-4 py-2"
                                placeholder="tu.correo@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Asunto
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 px-4 py-2"
                                placeholder="¿De qué se trata?"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 px-4 py-2"
                                placeholder="Tu mensaje aquí..."
                            ></textarea>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitted}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                            ${isSubmitted ? 'bg-green-600' : 'bg-[#8B4513] hover:bg-[#6f3610]'} 
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513] transition-colors
                                            disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitted ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
