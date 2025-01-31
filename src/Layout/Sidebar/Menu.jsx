import { FaHome, FaTicketAlt, FaTasks, FaBox, FaBan, FaChartBar, FaUser,FaLock,FaRupeeSign } from 'react-icons/fa';
import { TbReportSearch } from "react-icons/tb";
import { GiAutoRepair } from "react-icons/gi";
import { MdOutlinePayment } from "react-icons/md";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { GrServices } from "react-icons/gr";

export const MENUITEMS = [
  {
      "Items": [
          {
              "icon": "fa fa-th-large fa-1x",
              "title": "Dashboard",
              "type": "link",
              "path": "/dashboard"
          },
          {
              "icon": "fa fa-ticket fa-1x",
              "title": "Tickets",
              "type": "link",
              "path": "/tickets"
          },
          {
              "icon": "fa fa-building fa-1x",
              "title": "Our Aasra",
              "type": "link",
              "path": "/add-aasra"
          },
          {
              "icon": "fa fa-shopping-cart fa-1x",
              "title": "Purchase",
              "type": "sub",
              "children": [
                  {
                      "active": false,
                      "title": "All Purchase",
                      "path": "purchase/all-purchase",
                      "type": "link"
                  }
              ]
          },
          {
              "icon": "fa fa-truck fa-1x",
              "title": "Stock Transfer",
              "type": "link",
              "path": "/stock-transfer"
          },
          {
              "icon": "fa fa-users fa-1x",
              "title": "Users",
              "type": "sub",
              "children": [
                  {
                      "active": false,
                      "title": "Add User",
                      "path": "user/add-user",
                      "type": "link"
                  }
              ]
          },
          {
              "icon": "fa fa-user-secret fa-1x",
              "title": "Master",
              "type": "sub",
              "children": [
                  {
                      "active": false,
                      "title": "Category",
                      "path": "master/category",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "UOM",
                      "path": "master/uom",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Labour Charge",
                      "path": "master/labour-charge",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Spare Parts",
                      "path": "master/spare-parts",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Problem",
                      "path": "master/problem",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Manufacturer",
                      "path": "master/manufacturer",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Other Centre",
                      "path": "master/center",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Part Serial No",
                      "path": "master/parts-serial",
                      "type": "link"
                  },
                  {
                      "active": false,
                      "title": "Import stock",
                      "path": "master/upload-stock",
                      "type": "link"
                  }
              ]
          },
          {
              "icon": "fa fa-file fa-1x",
              "title": "Payment Reports",
              "type": "link",
              "path": "/payment-reports"
          },
          {
              "icon": "fa fa-money fa-1x",
              "title": "Transaction",
              "type": "link",
              "path": "/payment-list"
          },
          {
              "icon": "fa fa-shopping-cart fa-1x",
              "title": "Inventory Reports",
              "type": "link",
              "path": "/inventory-reports"
          },
          {
              "icon": "fa fa-exchange fa-1x",
              "title": "Replacement Reports",
              "type": "link",
              "path": "parts-replacement-report"
          },
          {
              "icon": "fa fa-list fa-1x",
              "title": "Stock Reports",
              "type": "link",
              "path": "as-a-whole-stock-report"
          },
          {
              "icon": "fa fa-history fa-1x",
              "title": "Service History",
              "type": "link",
              "path": "service-history"
          },
          {
              "icon": "fa fa-wrench fa-1x",
              "title": "Repair Reports",
              "type": "link",
              "path": "/repair-reports"
          },
          {
              "icon": "fa fa-file fa-1x",
              "title": "Revenue Reports",
              "type": "link",
              "path": "/revenue-reports"
          },
          {
              "icon": "fa fa-cogs fa-1x",
              "title": "Service Notes",
              "type": "link",
              "path": "service-notes"
          },
          {
              "icon": "fa fa-shopping-cart fa-1x",
              "title": "Sale ",
              "type": "sub",
              "children": [
                  {
                      "active": false,
                      "title": "All Sale",
                      "path": "sales/sales-list",
                      "type": "link"
                  }
              ]
          }
      ]
  }
]

export const AASRAMENU = [
  {
    Items: [
      {
        title: "Dashboards",
        icon: "home",
        type: "link",
        path: "dashboard",
      },
      {
        title: "Tickets",
        icon: "task",
        type: "link",
        path: "tickets",
      },
      {
        title: "Inventory Reports",
        icon: "home",
        type: "link",
        path: "inventory-reports",
      },
      {
        title: "Revenue Reports",
        icon: "home",
        type: "link",
        path: "revenue-reports",
      },
      {
        title: "Payment Reports",
        icon: "home",
        type: "link",
        path: "payment-reports",
      },
      {
        title: "Replacement Reports",
        icon: "home",
        type: "link",
        path: "parts-replacement-report",
      },
      {
        title: "Stock Reports",
        icon: "home",
        type: "link",
        path: "as-a-whole-stock-report",
      },
      {
        title: "Transaction",
        icon: "home",
        type: "link",
        path: "payment-list",
      },

      {
        title: "Purchase",
        icon: "home",
        type: "sub",
        children: [
          {
            active: false,
            path: `purchase/create-purchase`,
            title: "Create Purchase",
            type: "link",
          },
          {
            active: false,
            path: `purchase/all-purchase`,
            title: "All Purchase",
            type: "link",
          },
        ],
      },
    ],
  },
];
