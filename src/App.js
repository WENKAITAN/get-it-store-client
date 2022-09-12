import React from 'react';
import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
} from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import './App.css';
import Navigation from './components/Navigation';
import ItemsByShelf from './components/ItemsByShelf';
import SearchResults from './components/SearchResults';
import NotFoundError from './components/error/NotFoundError';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Account from './components/Account';
import PrivateRoute from './components/PrivateRoute';
import Success from './components/Success';
import Cancel from './components/Cancel';
import logo from './images/logo.png'
class App extends React.Component {

  state = {
    cart: {},
    items: {}
  }

  addToCart = (item) => {
    let key = `${item.id}-${item.size}`;
    // if the item is already in the cart, just update the quantity
    if(key in this.state.cart){
      this.setState({
        cart: {
          ...this.state.cart,
          [key]: {
            ...this.state.cart[key],
            quantity: this.state.cart[key].quantity + item.quantity
          }
        }
      })
      let history = JSON.parse(localStorage.getItem("cart")) || {};
      history[key].quantity += item.quantity;
      localStorage.setItem("cart", JSON.stringify(history))
    }else{
      //if not, create a new Object
      this.setState({
        cart: {
          ...this.state.cart,
          [key]: item
        }
      })
      let history = JSON.parse(localStorage.getItem("cart")) || {};
      history[key] = item
      localStorage.setItem("cart", JSON.stringify(history))
    }

  }


  deleteItems = (id) => {
    console.log(id)
    this.setState((prevState) => {
      const state = {...prevState};
      state.cart[id] = undefined;
      return state;
    })
    let history = JSON.parse(localStorage.getItem("cart"))
    history[id] = undefined;
    localStorage.setItem("cart", JSON.stringify(history))
  }
  componentDidMount(){
    fetch("https://get-it-store-backend.herokuapp.com/api/product")
    .then(res => res.json())
    .then(products => {
      const items = {}
      for(let i=0; i < products.length; i++){
        const item = products[i];
        items[item.product_id] = item
      }
      this.setState({
        ...this.state,
        items
      })
    })
  }

  render() {
    const { items, cart } = this.state;
    return (
          <Router>
            <Navigation items={items} cart={cart}/>
            <Switch>
              <Route exact path="/" render={(props) => (
                  <div className="c-wrapper">
                      {/* <div className="header"></div> */}
                      <div id="carouselSlide" className="carousel slide z-depth-1-half" data-ride="carousel">
                        <div className="carousel-inner">
                          <div className="carousel-item active">
                            <img className="d-block w-100" style={{  objectFit: "contain" }} src={logo} alt="First slide" />
                          </div>
                          <div className="carousel-item" >
                            <img className="d-block w-100" style={{ objectFit: "contain" }} src="https://cdn.shopify.com/s/files/1/0133/1907/7947/products/MASCOTHACKYSACK_DETAIL_900x.jpg?v=1623200262/" alt="First slide" />
                          </div>
                          <div className="carousel-item" >
                            <img className="d-block w-100" style={{ objectFit: "contain" }} src="https://cdn.shopify.com/s/files/1/0133/1907/7947/products/DENIM-07_1_1_900x.jpg?v=1634171742" alt="Second slide" />
                          </div>
                          <div className="carousel-item">
                            <img className="d-block w-100" style={{ objectFit: "contain" }}src="https://cdn.shopify.com/s/files/1/0133/1907/7947/products/DENIM-13_1_1_900x.jpg?v=1634264666" alt="Third slide" />
                          </div>
                        </div>
                        <a className="carousel-control-prev" href="#carouselSlide" role="button" data-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselSlide" role="button" data-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="sr-only">Next</span>
                        </a>
                    </div>
                      <ItemList {...props} items={items} />
                  </div>
                )} 
              />
              <Route  path="/products/:id" render={(props) => (
                <ItemDetail {...props} items={items} addToCart={(itemInfo) => this.addToCart(itemInfo)}/>
              )} 
              />
              <Route path="/products" render={(props) => (
                <ItemsByShelf {...props} items={items} />
              )}
              />
              <Route path="/search-results" render={(props) => (
                <SearchResults {...props} items={items} />
              )}
              />
              <Route path="/cart" render={(props) => (
                <Cart {...props} items={items} cart={cart} itemdelete={( id ) => this.deleteItems( id)} updateQuantity={( id, quantity ) => this.updateItem( id, quantity)}/>
              )}
              />
              <PrivateRoute path="/account" component={Account}/>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/success" component={Success} />
              <Route path="/cancel" component={Cancel} />
              {/* <Route exact path="/aboutus" component={AboutUsPage} /> */}
              <Route component={NotFoundError}/>
            </Switch>
        </Router>
    );
  }
}


export default App;

