import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout"
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "Login",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "控制台",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        meta: {
          title: "首页"
        },
        component: () => import("../views/Console/index.vue"),
      }
    ]
  },
  {
    path: "/parking",
    name: "Parking",
    meta: {
      title: "停车场",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/parkingIndex",
        name: "ParkingIndex",
        meta: {
          title: "列表管理"
        },
        component: () => import("../views/Parking/index.vue"),
      },
      {
        path: "/parkingAdd",
        name: "ParkingAdd",
        meta: {
          title: "新增停车场"
        },
        component: () => import("../views/Parking/add.vue"),
      }
    ]
  },
  {
    path: "/carsBrand",
    name: "CarsBrand",
    meta: {
      title: "车辆品牌",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/carsBrandIndex",
        name: "CarsBrandIndex",
        meta: {
          title: "品牌列表"
        },
        component: () => import("../views/carsBrand/index.vue"),
      }
    ]
  },
  {
    path: "/cars",
    name: "Cars",
    meta: {
      title: "车辆管理",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/carsAttr",
        name: "CarsAttr",
        meta: {
          title: "车辆属性"
        },
        component: () => import("../views/Cars/attrList.vue"),
      },
      {
        path: "/carsIndex",
        name: "CarsIndex",
        meta: {
          title: "车辆列表"
        },
        component: () => import("../views/Cars/index.vue"),
      },
      {
        path: "/carsAdd",
        name: "CarsAdd",
        meta: {
          title: "新增车辆"
        },
        component: () => import("../views/Cars/add.vue"),
      }
    ]
  },
  {
    path: "/sale",
    name: "Sale",
    meta: {
      title: "销售管理",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/leaseList",
        name: "LeaseList",
        meta: {
          title: "租车类型"
        },
        component: () => import("../views/Sale/leaseList.vue"),
      }
    ]
  },
  {
    path: "/member",
    name: "Member",
    meta: {
      title: "会员管理",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/memberList",
        name: "MemberList",
        meta: {
          title: "会员列表"
        },
        component: () => import("../views/Member/index.vue"),
      },
      {
        path: "/memberDetailed",
        name: "MemberDetailed",
        hidden:true,
        meta: {
          title: "会员详情"
        },
        component: () => import("../views/Member/detailed.vue"),
      },
      {
        path: "/memberEdit",
        name: "MemberEdit",
        hidden:true,
        meta: {
          title: "会员编辑"
        },
        component: () => import("../views/Member/edit.vue"),
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
