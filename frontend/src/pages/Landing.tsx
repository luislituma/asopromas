import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Heart } from 'lucide-react';
import asopromasLogo from '../assets/icons/logo.svg';
import ButtonBuy from '../components/ButtonBuy';
import CTA from '../components/CTA';

const Landing: FC = () => {
  const features = [
    {
      icon: <Award className="h-8 w-8 text-brown-600" />,
      title: "Premium Quality",
      description: "Our chocolates are crafted from the finest cacao beans in Ecuador"
    },
    {
      icon: <Users className="h-8 w-8 text-brown-600" />,
      title: "Community First",
      description: "Supporting local farmers and their families through fair trade practices"
    },
    {
      icon: <Heart className="h-8 w-8 text-brown-600" />,
      title: "Sustainable Future",
      description: "Committed to environmentally conscious farming methods"
    }
  ];

  const products = [
    {
      image: "/src/assets/images/products/chocolate-bar.jpg",
      title: "Artisanal Chocolate Bars",
      description: "Experience the pure taste of Ecuador in every bite",
      link: "/products/chocolate-bar"
    },
    {
      image: "/src/assets/images/products/chocolate-drink.jpg",
      title: "Premium Cocoa Drinks",
      description: "Rich and aromatic beverages for chocolate lovers",
      link: "/products/chocolate-drink"
    },
    {
      image: "/src/assets/images/products/cocoa-liquor.jpg",
      title: "Pure Cocoa Liquor",
      description: "The essence of fine Ecuadorian cacao",
      link: "/products/cocoa-liquor"
    }
  ];

  return (    
    <div className="flex flex-col min-h-screen">
      <div>
        <CTA />
      </div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brown-800 to-brown-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6">
                Discover the Finest Ecuadorian Chocolate
              </h1>
              <p className="text-xl mb-8 text-brown-100">
                ASOPROMAS brings you premium quality cacao products from the heart of Zamora Chinchipe
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-white text-brown-600 px-8 py-3 rounded-lg hover:bg-brown-50 transition-colors inline-flex items-center"
                >
                  Explore Products
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-brown-600 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={asopromasLogo}
                alt="ASOPROMAS"
                className="h-64 w-auto filter drop-shadow-xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block h-20 w-full"
            fill="white"
          >
            <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V120H0V0c67.23 25.24 138.96 52.2 321.39 56.44z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ASOPROMAS?</h2>
            <div className="h-1 w-20 bg-brown-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <div className="h-1 w-20 bg-brown-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link
                key={index}
                to={product.link}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-brown-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <p className="text-gray-600 mb-6 text-lg">
              ASOPROMAS is a proud association of cacao producers in Zamora Chinchipe, Ecuador. 
              Our journey began with a simple mission: to produce the finest quality cacao while 
              supporting our local farming communities.
            </p>
            <p className="text-gray-600 mb-8 text-lg">
              Today, we continue to uphold these values, combining traditional farming wisdom 
              with modern sustainable practices to create exceptional chocolate products that 
              are enjoyed around the world.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-brown-600 hover:text-brown-700 font-semibold"
            >
              Learn more about our journey
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-64 w-full rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-amber-950">Ready to Experience Our Products?</h2>
          <p className="text-xl mb-8 text-brown-100">
            Discover the rich flavors of our premium chocolate and cocoa products
          </p>
          
        </div>

            <div className='flex justify-center'>
                <ButtonBuy />
                </div>
      </section>
    </div>
  );
};

export default Landing;
