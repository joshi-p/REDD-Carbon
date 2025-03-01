import { Navbar, Welcome, Footer, Services, Transactions } from './components';
import { TransactionProvider } from './context/TransactionContext'; // Import the provider

const App = () => {
  return (
    <TransactionProvider>  {/* Wrap the entire app with the provider */}
      <div className='min-h-screen'>
        <div className='gradient-bg-welcome'>
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </TransactionProvider>
  );
};

export default App;
