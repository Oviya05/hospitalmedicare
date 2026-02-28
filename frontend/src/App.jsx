import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Routers from "./routes/Routers"
const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  )
}
export default App
