import { Link } from 'react-router-dom'
import { HeartPulse, Salad, BookOpenCheck, ArrowRight } from 'lucide-react'

function Home() {
  return (
    <div>

      {/* ---- Section Hero ---- */}
      <section className="bg-base-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-base-content mb-4">
            Une alimentation locale, <span className="text-primary">pensée pour votre santé</span>
          </h1>
          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            FoodHealth s'appuie sur une ontologie des aliments camerounais pour aider
            médecins et patients à comprendre le lien entre alimentation locale et
            maladies comme le diabète, la malnutrition et l'obésité.
          </p>
          <Link to="/usages" className="btn btn-primary btn-lg gap-2">
            Consulter l'ontologie
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ---- Section image illustrative ---- */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80"
            alt="Plat camerounais traditionnel"
            className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* ---- Section "Pourquoi ce projet" ---- */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Pourquoi cette application ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body items-center text-center">
                <HeartPulse className="text-primary mb-2" size={36} />
                <h3 className="card-title text-base">Lutter contre les maladies</h3>
                <p className="text-sm text-base-content/70">
                  Identifier rapidement les aliments locaux à privilégier ou à
                  éviter pour mieux contrôler sa santé.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body items-center text-center">
                <Salad className="text-primary mb-2" size={36} />
                <h3 className="card-title text-base">Prévenir la malnutrition</h3>
                <p className="text-sm text-base-content/70">
                  Valoriser les aliments traditionnels riches en nutriments,
                  adaptés à chaque région du pays.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body items-center text-center">
                <BookOpenCheck className="text-primary mb-2" size={36} />
                <h3 className="card-title text-base">Une base de connaissances fiable</h3>
                <p className="text-sm text-base-content/70">
                  Une ontologie enrichie en continu, reliant aliments, régions
                  et maladies de façon structurée.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default Home