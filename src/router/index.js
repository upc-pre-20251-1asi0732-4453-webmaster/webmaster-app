import { createRouter, createWebHistory } from "vue-router";

//Componentes de Login
import LoginCard from '../authentication/components/login-card.component.vue';
import PasswordRecoveryCard from '../authentication/components/password-recovery-card.component.vue';
import RegisterCard from '../authentication/components/register-card.component.vue';
import MainPage from "../main-page/pages/main-page.view.vue";
import SearchDeveloperList from "../enterprise/search-developer/pages/search-developer-list.component.vue";
import ToolbarEnterpriseComponent from "../public/components/toolbar-enterprise.component.vue";
import FooterWebstormComponent from "../public/components/footer-webstorm.component.vue";
import HomePage from "../enterprise/home-enterprise/pages/home-page.component.vue";
import MessagePage from "../shared/components/message-form.component.vue";
import LoginComponent from "../authentication/pages/login.component.vue";
import DeveloperProfilePage from "../developer/developer-profile/pages/developer-profile-page.vue";
import CreateProject from "../enterprise/create-project/pages/create-project-page.component.vue";

import HomePageDeveloper from "../developer/home-developer/pages/home-page.component.vue";
import SearchProjectList from "../developer/search-project/pages/search-project-list.component.vue";
import EnterpriseProfilePage from "../enterprise/enterprise-profile/pages/enterprise-profile-page.vue";
import PostulateProject from "../developer/postulate-project/pages/postulate-project-page.component.vue";

import SupportPage from "../shared/pages/support-page.vue";
import DeliverablesDetailsCard from "../enterprise/deliverables-edit/components/deliverables-edit-card.vue";
import DeliverableReview from "../enterprise/deliverables-enterprise/pages/review-deliverable.component.vue";
import ApprovedDeliverable from "../enterprise/deliverables-states/pages/approved-deliverable.vue";
import RejectedDeliverable from "../enterprise/deliverables-states/pages/rejected-deliverable.vue";

import DeliverablesListDeveloper from '../developer/deliverables-schedule/pages/deliverable-list-developer.vue';
import DeliverableList from "../enterprise/deliverables-schedule/pages/deliverable-list.vue";

import CreateDeliverable from "../developer/deliverables-developer/pages/create-deliverable.component.vue";
import SendedDeliverable from "../developer/deliverable-send/pages/deliverable-send.component.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: LoginComponent,
            name: 'login'
        },
        {
            path: '/password-recovery',
            component: PasswordRecoveryCard,
            name: 'password-recovery'
        },
        {
            path: '/register',
            component: RegisterCard,
            name: 'register'
        },
        {
            path: '/home',
            name: 'home',
            component:  MainPage ,
            children: [
                {
                  path: '/main/developers/:id',
                  component:HomePageDeveloper,
                  name: 'main-developer'
                },
                {
                    path: '/main/enterprises/:id',
                    component: HomePage,
                    name: 'main-enterprise'
                },
                {
                    path: '/main/developers/:id',
                    component:HomePageDeveloper,
                },
                {
                    path: '/search-project',
                    name: 'search-project',
                    component: SearchProjectList
                },
                {
                    path: '/search-developer',
                    name: 'search-developer',
                    component: SearchDeveloperList
                },
                {
                    path:'',
                    // path: '/message',
                    name: 'message-page',
                    component: MessagePage
                },
                {
                    path: '/create-project',
                    name: 'create-project',
                    component: CreateProject
                },
                {
                    path: '/projects/:projectId/Deliverables',
                    name: 'deliverable-list',
                    component: DeliverableList
                },
                {
                    path: '/projects/developers/:projectId/Deliverables',
                    name: 'deliverables-list-developer',
                    component:DeliverablesListDeveloper
                },
                {
                  path:'/projects/:projectId/Deliverables/:deliverableId',
                  name: 'deliverable-edit',
                  component:DeliverablesDetailsCard
                },
                {
                    path:'/projects/:projectId/Deliverables/:deliverableId/review',
                    name:'review-deliverable',
                    component: DeliverableReview
                },
                {
                    path:'/projects/:projectId/Deliverables/:deliverableId/Approved',
                    name:'approved-deliverable',
                    component: ApprovedDeliverable
                },
                {
                    path:'/projects/:projectId/Deliverables/:deliverableId/Rejected',
                    name:'rejected-deliverable',
                    component: RejectedDeliverable
                },
                {
                    path:'/projects/developers/:projectId/deliverables/:deliverableId/create',
                    name:'create-deliverable',
                    component:CreateDeliverable
                },
                {
                    path:'/projects/:projectId/Deliverables/:deliverableId/Upload',
                    name:'deliverable-send',
                    component:SendedDeliverable
                },
                {
                    path: '/enterprise-profile/:id',
                    name: 'enterprise-profile',
                    component: EnterpriseProfilePage
                },
                {
                    path: '/developer-profile/:id',
                    name: 'developer-profile',
                    component: DeveloperProfilePage
                },
                {
                    path: '/postulate-project/:project_id',
                    name: 'postulate-project',
                    component: PostulateProject
                },
                {
                    path: '/support',
                    name: 'support',
                    component: SupportPage
                }
            ]
        },
    ]
});

export default router;