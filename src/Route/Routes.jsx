// //Samp lePage
import InvoiceSlip from '../Components/Common/GenratePo';
import UpdatePurchase from '../MyPages/Purchase/UpdatePurchase';

import Error404 from '../Components/Pages/ErrorPages/ErrorPage404';

import SamplePage from '../Components/Pages/PageLayout/SimplePage';
import CreateTicket from '../MyPages/Aasra center/Createticket';
import AddAasra from '../MyPages/Aasra/AddAasra';
import OurAasra from '../MyPages/Aasra/OurAasra';
import Chat from '../MyPages/Chat/Chat';
import Dashboard from '../MyPages/Dashboard';
import Category from '../MyPages/Master/Category';
import LabourCharge from '../MyPages/Master/LabourCharge';
import SpareParts from '../MyPages/Master/SpareParts';
import AllPurchase from '../MyPages/Purchase/AllPurchase';
import CreatePurchase from '../MyPages/Purchase/CreatePurchase';
import PaymentList from '../MyPages/Purchase/PaymentList';
import PurchaseDetail from '../MyPages/Purchase/PurchaseDetail';
import InventoryReports from '../MyPages/Reports/InventoryReports';
import RepairReports from '../MyPages/Reports/RepairReports';
import RevenueReports from '../MyPages/Reports/RevenueReports';
import ServiceChargeWP from '../MyPages/Service/ServiceChargeWP';
import AllTickets from '../MyPages/Tickets/AllTickets';
import TicketDetail from '../MyPages/Tickets/TicketDetail';
import Master from '../MyPages/UserPermission/Master';
import Permission from '../MyPages/UserPermission/Permission';
import UserMaster from '../MyPages/UserPermission/UserMaster';
import UnitOfMeasurement from '../MyPages/Master/UnitOfMeasurement';
import PaymentReports from '../MyPages/Reports/PaymentReports';
import PartsReplacementReports from '../MyPages/Reports/PartsReplacementReports';
import AaAwholeStockReport from '../MyPages/Reports/AaAwholeStockReport';
import Problem from '../MyPages/Master/Problem';
import Manufacture from '../MyPages/Master/Manufacture';
import ServiceHistory from '../MyPages/Service/ServiceHistory';
import Center from '../MyPages/Master/Center';
import StockTransfer from '../MyPages/Purchase/StockTransfer';
import ViewAasraDetails from '../MyPages/Aasra/ViewAasraDetails';
import ServiceNotes from '../MyPages/Service/ServiceNotes';
import ComingSimple from '../Components/Pages/ComingSoon/ComingSimple';
import OrderSuccess from '../MyPages/Razorpay/OrderSuccess';
import UnderWarrantyPurchase from '../MyPages/Purchase/UnderWarrantyPurchase';
import Sales from '../MyPages/Sales/Sales';
import SalesList from '../MyPages/Sales/SalesList';
import PartsSerialno from '../MyPages/Master/PartsSerialno';
import CreateCall from '../MyPages/CallCentre/CreateCall';
import UploadStock from '../MyPages/Master/UploadStock';
import UserRegister from '../MyPages/Aasra center/UserRegister';
import AasraPaymentReports from '../MyPages/Reports/AasraTransactionReport';
export const routes = [
  // //page
  { path: `${process.env.PUBLIC_URL}/sample-page`, Component: <SamplePage /> },
  { path: `${process.env.PUBLIC_URL}/slip`, Component: <InvoiceSlip /> },
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: <Dashboard /> },
  { path: `${process.env.PUBLIC_URL}/add-aasra`, Component: <AddAasra /> },
  { path: `${process.env.PUBLIC_URL}/view-aasra/:id`, Component: <ViewAasraDetails /> },
  { path: `${process.env.PUBLIC_URL}/inventory-reports`, Component: <InventoryReports /> },
  { path: `${process.env.PUBLIC_URL}/revenue-reports`, Component: <RevenueReports /> },
  { path: `${process.env.PUBLIC_URL}/service-charge-w-p`, Component: <ServiceChargeWP /> },
  { path: `${process.env.PUBLIC_URL}/tickets`, Component: <AllTickets /> },
  { path: `${process.env.PUBLIC_URL}/service-history`, Component: <ServiceHistory /> },
  { path: `${process.env.PUBLIC_URL}/ticket-detail`, Component: <TicketDetail /> },
  { path: `${process.env.PUBLIC_URL}/chat`, Component: <Chat /> },
  { path: `${process.env.PUBLIC_URL}/master/uom`, Component: <UnitOfMeasurement /> },
  { path: `${process.env.PUBLIC_URL}/master/category`, Component: <Category /> },
  { path: `${process.env.PUBLIC_URL}/master/problem`, Component: <Problem /> },
  { path: `${process.env.PUBLIC_URL}/master/manufacturer`, Component: <Manufacture /> },
  { path: `${process.env.PUBLIC_URL}/master/center`, Component: <Center /> },
  { path: `${process.env.PUBLIC_URL}/master/labour-charge`, Component: <LabourCharge /> },
  { path: `${process.env.PUBLIC_URL}/master/spare-parts`, Component: <SpareParts /> },
  { path: `${process.env.PUBLIC_URL}/master/parts-serial`, Component: <PartsSerialno /> },
  { path: `${process.env.PUBLIC_URL}/master/upload-stock`, Component: <UploadStock /> },
  { path: `${process.env.PUBLIC_URL}/add-beneficiary`, Component: <UserRegister /> },
  { path: `${process.env.PUBLIC_URL}/user/permission`, Component: <Permission /> },
  { path: `${process.env.PUBLIC_URL}/user/add-user`, Component: <Master /> },
  { path: `${process.env.PUBLIC_URL}/purchase/create-purchase`, Component: <CreatePurchase /> },
  { path: `${process.env.PUBLIC_URL}/purchase/under-warranty`, Component: <UnderWarrantyPurchase /> },
  { path: `${process.env.PUBLIC_URL}/purchase/all-purchase`, Component: <AllPurchase /> },
  { path: `${process.env.PUBLIC_URL}/repair-reports`, Component: <RepairReports /> },
  { path: `${process.env.PUBLIC_URL}/purchase/details/:id`, Component: <PurchaseDetail /> },
  { path: `${process.env.PUBLIC_URL}/purchase/update/:id`, Component: <UpdatePurchase /> },
  { path: `${process.env.PUBLIC_URL}/stock-transfer`, Component: <StockTransfer /> },
  { path: `${process.env.PUBLIC_URL}/service-notes`, Component: <ServiceNotes /> },
  { path: `${process.env.PUBLIC_URL}/purchase/payment`, Component: <PurchaseDetail /> },
  { path: `${process.env.PUBLIC_URL}/payment-list`, Component: <PaymentList /> },
  { path: `${process.env.PUBLIC_URL}/payment-reports`, Component: <PaymentReports /> },
  { path: `${process.env.PUBLIC_URL}/parts-replacement-report`, Component: <PartsReplacementReports /> },
  { path: `${process.env.PUBLIC_URL}/create-ticket`, Component: <CreateTicket /> },
  { path: `${process.env.PUBLIC_URL}/as-a-whole-stock-report`, Component: <AaAwholeStockReport /> },
  { path: `${process.env.PUBLIC_URL}/*`, Component: <Error404 /> },
  { path: `${process.env.PUBLIC_URL}/user-profile`, Component: <ComingSimple /> },
  { path: `${process.env.PUBLIC_URL}/order-success`, Component: <OrderSuccess /> },
  { path: `${process.env.PUBLIC_URL}/order-failed`, Component: <OrderSuccess /> },
  { path: `${process.env.PUBLIC_URL}/sales/create-sell`, Component: <Sales /> },
  { path: `${process.env.PUBLIC_URL}/sales/sales-list`, Component: <SalesList /> },
{ path: `${process.env.PUBLIC_URL}/create-call`, Component: <CreateCall/> },
{ path: `${process.env.PUBLIC_URL}/Aasra-Payment-Reports`, Component: <AasraPaymentReports/> },
];
