import Route1085 from '@/views/business/1085/route'
import Route1065 from '@/views/business/1065/route'
import Route1103 from '@/views/business/1103/route'
import RouteTopic from '@/views/business/topic/route'
import RouteBasice from '@/views/business/basice/route'
import Route1123 from '@/views/business/1123/route'

/**
 * 业务相关路由
 */
export default [RouteBasice, ...RouteTopic, ...Route1065, ...Route1085, ...Route1103, ...Route1123]
