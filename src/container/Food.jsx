import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Title, ToolBar, Cart, Modal, Message, Toast } from '../component';
import '../styles/food.css';
import icon1 from '../assets/img/1@2x.png';
import icon2 from '../assets/img/钱@2x.png';
import icon3 from '../assets/img/icon@2x.png';
import icon4 from '../assets/img/清空@2x.png';

import actions from '../actions';
import getParams from '../utils/getParams';
import apis from '../apis';
import websocket from '../utils/websocket';

class Food extends Component {
  static propTypes = {
    mask: PropTypes.bool,
    message: PropTypes.bool,
    once:  PropTypes.bool,
    shop_list: PropTypes.array,
    changeMaskState: PropTypes.func,
    changeMessageState: PropTypes.func,
    fetchFoodList: PropTypes.func,
    changeFoodNumber: PropTypes.func
  }
  constructor() {
    super();
    this.state = {
      currentIndex: 0,
      foodBool: false,
      cartBool: false,
      modalBool: false,
      toastBool: false,
      bb_z_index: 5,
      c_rf: {},
      m_type: '',
      message_type: '',
      ro_number: '',
      tableName: decodeURI(getParams('tableName')),
      shopid: getParams('shopid'),
      tableid: getParams('tableid'),
    };
    this.changeCurrent = this.changeCurrent.bind(this);
    this.showFood = this.showFood.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  componentDidMount() {
    this.props.changeMaskState(true);
    this.props.fetchFoodList({shopid: this.state.shopid});
    // ws
    websocket(window.shop+this.state.shopid, (event) => {
      const data = JSON.parse(event.data);
      switch (data.code) {
        case 8: console.log('菜品变化'); this.props.fetchFoodList({shopid: this.state.shopid}); break;
        default: break;
      }
    });

    websocket(window.client+this.state.tableid, (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.code === 4 ||  data.code === 6 || data.code === 9) {
        axios.post(apis.c_open_table, {
          shopid: this.state.shopid,
          ro_tableid: this.state.tableid
        })
          .then(res => {
            if (res.data.result) {
              this.setState({ ro_number: res.data.result.ro_number});
              this.props.changeMaskState(false);
            } else {
              this.setState({ ro_number: ''});
              this.props.changeMaskState(true);
            }
          });
      } else if (data.code === 5) {
        console.log(decodeURIComponent(data.url));
        location.href = decodeURIComponent(data.url); // eslint-disable-line
      }
    });

    axios.post(apis.c_open_table, {
      shopid: this.state.shopid,
      ro_tableid: this.state.tableid
    })
      .then(res => {
        if (res.data.result) {
          this.setState({ ro_number: res.data.result.ro_number});
          this.props.changeMaskState(false);
        }
      });
  }

  componentDidUpdate() {
    const arrH = Object.values(this.refs).map(elm => elm.offsetTop);
    for (let i = 0; i < arrH.length; i++) {
      window.addEventListener('scroll', () => {
        if (arrH[i] < document.body.scrollTop + this.barDis + 50
          && document.body.scrollTop + this.barDis < arrH[i + 1] - 50) {
          if (this.state.currentIndex !== i) {
            this.setState({
              currentIndex: i
            });
          }
        }
      });
    }
  }

  get barDis() {
    return parseInt(window.getComputedStyle(document.documentElement).fontSize, 10);
  }

  get order() {
    const arr = [];
    this.props.shop_list.forEach(item => {
      item.productList.forEach(item => {
        arr.push(item)
      })
    })
    return arr.filter(item => item.rf_number);
  }

  get modalOption() {
    const that = this;
    const obj = {
      hujiao: {
        text: '是否确认呼叫服务员？',
        click() {
          that.setState({ toastBool: true });
          axios.post(apis.call_service, {
            shopid: that.state.shopid,
            tablename: that.state.tableName
          })
            .then(res => {
              if (res.data.result) {
                that.setState({
                  modalBool: false,
                  message_type: '',
                  toastBool: false
                });
                that.props.changeOnce(true);
                that.props.changeMaskState(false);
                that.props.changeMessageState(true);
              }
            })
        },
      },
      maidan: {
        text: '是否确认呼叫买单？',
        click() {
          that.setState({ toastBool: true });
          axios.post(apis.call_payment, {
            shopid: that.state.shopid,
            tablename: that.state.tableName
          })
            .then(res => {
              if (res.data.result) {
                that.setState({
                  modalBool: false,
                  message_type: '',
                  toastBool: false
                });
                that.props.changeOnce(true);
                that.props.changeMaskState(false);
                that.props.changeMessageState(true);
              }
            })
        }
      },
      xiadan: {
        text: '请您适量点菜，避免浪费',
        click() {
          that.setState({ toastBool: true });
          axios.post(apis.order_add, {
            ros_number: that.state.ro_number,
            shopid: that.state.shopid,
            foodlist: that.order.map(item => ({
              ros_foodname: item.rf_name,
              ros_foodnum: item.rf_number,
              ros_foodprice: item.rf_price,
              rf_id: item.rf_id,
              ros_typeid: item.rf_type
            }))
          })
            .then(res => {
              if (res.data.result) {
                that.setState({
                  modalBool: false,
                  message_type: '点菜',
                  toastBool: false
                });
                that.props.changeOnce(true);
                that.props.changeMaskState(false);
                that.props.changeMessageState(true);
                that.props.clearOrder(that.props.shop_list);
              }
            })
            .catch(() => { alert('未开桌')})
        }
      }
    }
    return obj;
  }

  changeCurrent(index) {
    setTimeout(() => {
      this.setState({
        currentIndex: index
      });
    }, 50);
    setTimeout(() => {
      window.scrollBy(0, -this.barDis * 2.75);
    }, 10);
  }

  showFood(p) {
    this.props.changeMaskState(true);
    this.setState({
      foodBool: true,
      c_rf: p
    });
  }

  closeAll() {
    this.setState({
      foodBool: false,
      cartBool: false
    });
    this.props.changeMaskState(false);
  }

  render() {
    return (
      <div className="happy-wrapper" data-mask={this.props.mask}>
        <Title content={(<span style={{ color: "var(--theme)", flexBasis: "calc(195 / 32 * 1em)" }}>{this.state.tableName}</span>)} text="健康生活，从点餐开始" />
        <div className="happy__body">
          <ul className="happy__tabs _fix">
            {
              this.props.shop_list.map((item, index) => (
                <li className={`happy__tabs__item ${index === this.state.currentIndex ? 'active' : ''}`} key={index}>
                  <a href={`#panel${index}`} className="tab__link _undecor _block" onClick={() => { this.changeCurrent(index); }}>{item.typeName}</a>
                </li>
              ))
            }
          </ul>
          <div className="happy__content">
            {
              this.props.shop_list.map((item, index) => (
                <section className="item__panel" id={`panel${index}`} key={index} ref={`elm${index}`}>
                  <header className="item__title">{item.typeName}</header>
                  <dl className="item__list --unstyle-list">
                    {
                      item.productList.map((product, itemIndex) => (
                        <dd className="item --unstyle-list" key={product.rf_id} onClick={(e) => { e.stopPropagation();this.showFood(product); }}>
                          <div className="info" >
                            <a className="link" >
                              <img src={product.rf_imgae} alt="图片加载失败" />
                            </a>

                            <div className="text">
                              <p className="name _undecor">{product.rf_name}</p>
                              <p className="price -edit">
                                <span className="num">￥</span>{String(product.rf_price).split('.')[0]}
                                {
                                  parseInt(product.rf_price, 10) === product.rf_price ? null : '.'
                                }
                                <span className="num">{String(product.rf_price).split('.')[1]}</span>
                                <div className="nums">
                                  {
                                    product.rf_number !== 0 ? (<i
                                      className="icon-numcontroler minus"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        return (product.rf_number > 0) && this.props.changeFoodNumber(product.rf_id, product.rf_number - 1, this.props.shop_list);
                                      }}
                                    >-</i>) : null
                                  }
                                  {product.rf_number || null}
                                  <i
                                    className="icon-numcontroler"
                                    data-pid={product.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (product.rt_stock !== -1) {
                                        return (product.rf_number < product.rt_stock) && this.props.changeFoodNumber(product.rf_id, product.rf_number + 1, this.props.shop_list);
                                      } else return this.props.changeFoodNumber(product.rf_id, product.rf_number + 1, this.props.shop_list);
                                    }}
                                  >+</i>
                                </div>
                              </p>
                            </div>
                          </div>
                        </dd>
                      ))
                    }
                  </dl>
                </section>
              ))
            }
          </div>
        </div>
        {/* 提示框 */}
        <Message active={this.props.message} close={() => { this.props.changeMessageState(false); }}>
          { this.state.message_type === '点菜' ? (<div>点菜成功<br/>等待服务员上菜</div>) : (<div>已呼叫服务员<br/>请耐心等待</div>) }
        </Message>
        {/* 轻提示 */}
        <Toast active={this.state.toastBool}/>
        {/* 确认框 */}
        {
          this.state.modalBool ?
          <Modal text={this.modalOption[this.state.m_type].text}
            confirmClick={(e) => {
              e.stopPropagation();
                if (this.props.once) {
                  this.props.changeOnce(false);
                  this.modalOption[this.state.m_type].click();
                }
            }}
            cancelClick={() => {this.props.changeMaskState(false); this.setState({modalBool: false})}}/>
          : null
        }
        {
          !this.state.ro_number ? 
            <Modal text="暂时无法点餐，请联系服务员开桌" button="呼叫服务员"
              confirmClick={(e) => {
                e.stopPropagation();
                axios.post(apis.call_service, {
                  shopid: this.state.shopid,
                  tablename:  this.state.tableName,
                })
                  .then(res => {
                    if (res.data.result) {
                      this.props.changeMessageState(true);
                    }
                  })
              }}
            /> 
            : null
        }
        {/* 操作栏 */}
        <ToolBar>
          <div className="tool-bar-btn-wrapper">
            <div className="toolbar__btn"
              onClick={() => {this.props.changeMaskState(true); this.setState({ m_type: 'hujiao', modalBool: true })}}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('active');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('active');
              }}
              >
              <img src={icon1} alt="" />呼叫服务
            </div>
            <div className="toolbar__btn"
              onClick={() => {this.props.changeMaskState(true); this.setState({ m_type: 'maidan', modalBool: true })}}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('active');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('active');
              }}
              >
              <img src={icon2} alt="" />我要买单
            </div>
            <div className="toolbar__btn"
              onClick={() => {
                if (this.order.length) {
                  this.props.changeMaskState(true);
                  this.setState({ m_type: 'xiadan', modalBool: true });
                } else {
                  alert('请选择食物');
                }
              }}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('active');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('active');
              }}
            >
              <img src={icon3} alt="" />确定下单
            </div>
          </div>
        </ToolBar>
        {/* 购物车 */}
        <Cart count={this.order.length} handleClick={(e) => { e.stopPropagation(); this.props.changeMaskState(!this.props.mask); this.setState({ cartBool: !this.state.cartBool, bb_z_index: 3 })}}/>
        {/* 购物车面板 */}
        <section className={`cart-panel ${this.state.cartBool ? 'active' : ''}`}>
          <dl>
            <dt>
              <span>已点菜品</span>
              <div className="clear" onClick={() => {this.props.clearOrder(this.props.shop_list);this.props.changeMaskState(!this.props.mask); this.setState({ cartBool: !this.state.cartBool })}}>
                <img src={icon4} alt="" />
                清空
              </div>
            </dt>
            {
              this.order.map(product =>
                (<dd className="cart__dish" key={product.rf_id}>
                  {product.rf_name}
                  <div className="nums">
                    <span className="dish__price">￥{Math.round(product.rf_price * product.rf_number)}</span>
                    <i
                      className="icon-numcontroler minus"
                      onClick={(e) => {
                        e.stopPropagation();
                        return (product.rf_number > 0) && this.props.changeFoodNumber(product.rf_id, product.rf_number - 1, this.props.shop_list);
                      }}
                    >-</i>
                    {product.rf_number}
                    <i
                      className="icon-numcontroler"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.rt_stock !== -1) {
                          return (product.rf_number < product.rt_stock) && this.props.changeFoodNumber(product.rf_id, product.rf_number + 1, this.props.shop_list);
                        } else return this.props.changeFoodNumber(product.rf_id, product.rf_number + 1, this.props.shop_list);
                      }}
                    >+</i>
                  </div>
                </dd>
                ))
            }
          </dl>
        </section>
        {/* 菜品详情面板 */}
        <section className="food-panel" hidden={!this.state.foodBool}>
          <header className="img__wrapper">
            <img src={this.state.c_rf.rf_imgae} alt="加载失败"/>
          </header>
          <div className="food__info">
            <h2 className="food__name">{this.state.c_rf.rf_name}</h2>
            <h3 className="food__sku">来源：吉米呷呷生态超市 库存：{this.state.c_rf.rt_stock === -1 ? '99' : this.state.c_rf.rt_stock}</h3>
            <p className="food__ingredient">{this.state.c_rf.rf_body}</p>
          </div>
          <div className="food__bottom"><span className="food__price">￥{this.state.c_rf.rf_price}</span></div>
        </section>
        {/* 遮罩层 */}
        <div className="blackboard" style={{zIndex: this.state.bb_z_index}} hidden={!this.props.mask} onClick={() => { !this.state.modalBool && this.state.ro_number ? this.closeAll(): null }}/>
      </div >
    );
  }
}

export default connect(
  (state) => ({ mask: state.global.mask, message: state.global.message, shop_list: state.shopList, once: state.global.once }),
  {
    changeMaskState: actions.global.changeMaskState,
    changeMessageState: actions.global.changeMessageState,
    fetchFoodList: actions.shop.fetchFoodList,
    changeFoodNumber: actions.shop.changeFoodNumber,
    clearOrder: actions.shop.clearOrder,
    changeOnce: actions.global.changeOnce
  }
)(Food);
