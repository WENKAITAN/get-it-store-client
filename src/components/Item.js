import React, { Component } from "react";
import {Card, Image} from 'react-bootstrap';
import { Link } from "react-router-dom";
import LazyLoad from 'react-lazyload';
class Item extends Component {
    render() {
        const { id, items } = this.props;
        const item = items[id];
        return (
            <LazyLoad height={200}>
                <Link to={`/products/${id}`} style={{textDecoration:"none"}} > 
                    <Card style={{color: "black"}} className="grow h-100" >
                            <Image src={item['imageLink']} fluid />
                            <Card.Body>
                                <Card.Title><b>{item['name']}</b></Card.Title>
                                <hr/>
                                <div className="flex">
                                    <Card.Text>{item['color']}</Card.Text> 

                                    <Card.Text>${item['price']}</Card.Text>
                                </div>
                            </Card.Body>
                    </Card>
                </Link>
            </LazyLoad>

        )
    }
}

export default Item;