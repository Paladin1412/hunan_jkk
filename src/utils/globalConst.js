export const DEFAULT_ICON =
    'https://static.wecity.qq.com/lego_next_resources/couple-14c9e1844ae01edeef2173c77ecf2154.png'

export const AGE_ICONS = {
    '17-男':
        'https://static.wecity.qq.com/lego_next_resources/children-e427cddfd8497a3bf4cbdc86887f5d1b.png',
    '17-女':
        'https://static.wecity.qq.com/lego_next_resources/dautor-792a254040764e0a2a4bb8c14c8e4a8d.png',

    '54-男':
        'https://static.wecity.qq.com/lego_next_resources/couple-14c9e1844ae01edeef2173c77ecf2154.png',
    '54-女':
        'https://static.wecity.qq.com/lego_next_resources/user-icon-3787af4435309f12347b63924cdd4f27.png',

    '200-男':
        'https://static.wecity.qq.com/lego_next_resources/man-cf43793db6e7a4a6f678ca6d6c217305.png',
    '200-女':
        'https://static.wecity.qq.com/lego_next_resources/parent-e06cdf4df94393c0fc25dc960499cfd6.png',
}

export const getUserIcon = (age, gender) => {
    if (!age || !gender) {
        return DEFAULT_ICON
    }
    let key17 = Math.max(+age, 17)
    let key54 = Math.max(+age, 54)
    let key200 = Math.max(+age, 200)

    return (
        AGE_ICONS[`${key17}-${gender}`] ||
        AGE_ICONS[`${key54}-${gender}`] ||
        AGE_ICONS[`${key200}-${gender}`] ||
        DEFAULT_ICON
    )
}

export const RELATION_ITEMS = [
    { label: '本人', value: '0' },
    { label: '父母', value: '1' },
    { label: '子女', value: '2' },
    { label: '夫妻', value: '3' },
    // { label: '亲属', value: '4' },
    // { label: '朋友', value: '5' },
    { label: '其他', value: '6' },
]

export const RELATION_OBJ = {
    '0': '本人',
    '1': '父母',
    '2': '子女',
    '3': '夫妻',
    // '4': '亲属',
    // '5': '朋友',
    '6': '其他',
}
export const BASE_URL = 'https://jkkgzh.hnhfpc.gov.cn'
export const YLJL_URL = 'https://jkkyljl.hnhfpc.gov.cn'
export const TECENT_URL = 'https://h5-health.tengmed.com'
export const TECENT_API_URL = 'https://health.tengmed.com'
export const APP_ID = 'wx5c5ee20cde3b70e7'
export const HOSPITAL_ID = '30069'
export const CITY_CODE = '430100'

export const RECOMOND_MENU = [
    {
        label: '预约挂号',
        url: `${TECENT_URL}/open/cardpack/non-center-mode?appId=${APP_ID}&ecardNo=`, // `${YLJL_URL}/yygh/W_Yygh/index.html`,
        key: '1000',
        isrpc: 0,
        scene: '010101',
        icon:
            'https://yiliao-1254237151.cos.ap-shanghai.myqcloud.com/wxa/cardNew/recmmond/recmmond-icon1.png',
    },
    {
        label: '检验报告',
        url: `${BASE_URL}/yw/jyjc.html?HealthCode=`,
        key: '2000',
        isrpc: 1,
        scene: '0101022',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/check-c0b05d9a0bc7b9d8cead3c3af0f36008.png',
    },
    {
        label: '就诊记录',
        url: `${BASE_URL}/yw/ylfw.html?HealthCode=`,
        key: '2001',
        isrpc: 1,
        scene: '010108',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/hospital-ee9205fc25eb4f0143ff3275eba343c0.png',
    },
    {
        label: '计划免疫',
        // url: `${BASE_URL}/yw/jhmyxx.html?HealthCode=`,
        // key: '1003',
        moudleId: '37',
        isrpc: 1,
        scene: '0201032',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/疫苗服务-b584dda87e652d27059108c2dd5ea3ce.png',
    },
]

export const CUSTOMER_MENU = [
    {
        label: '母子健康手册',
        desc: '申领查看电子版手册',
        url: 'https://ggws.hnhfpc.gov.cn/Sys_Mzbj/index.aspx?HealthCode=&sfz=',
        key: '2003',
        isrpc: 1,
        scene: '0201021',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/preg-0b2cf56f05c6ff8ef10f7b46be4d945f.png',
    },
    {
        label: '健康档案',
        desc: '查询基层医疗档案',
        url: `${BASE_URL}/yw/jkda.html?HealthCode=`,
        key: '2002',
        isrpc: 1,
        scene: '0201091',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/record-a532b451e4ec77682405e2e961cad9a1.png',
    },
    {
        label: '生育服务手册',
        desc: '查询母亲生育证明',
        url: `${BASE_URL}/yw/syz.html?HealthCode=`,
        key: '2004',
        isrpc: 1,
        scene: '02010292',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/children-8d6f0c73570fa7ea270fa31364b59a0c.png',
    },
    {
        label: '出生医学证明',
        desc: '查询出生医学证明',
        url: `https://h5-health.tengmed.com/h5/report/certificate?cityCode=${CITY_CODE}&hospitalId=${HOSPITAL_ID}&healthCardId=`, // `${BASE_URL}/yw/csyxzm.html?HealthCode=`,
        key: '2005',
        isrpc: 1,
        scene: '02010371',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/birth-0cd94402ca9a9e93e50021d3b32cecf7.png',
    },
    {
        label: '计生奖励扶助',
        desc: '查询奖励扶助金记录',
        url: `${BASE_URL}/yw/jlfz.html?HealthCode=`,
        key: '2006',
        isrpc: 1,
        scene: '02010291',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/reward-3f5093fa467eb4ed4bad5865895acd95.png',
    },
    {
        label: '跨省健康码',
        desc: '扫描验证健康码状态',
        url: `${BASE_URL}/Wx_Scan/Scan.aspx`,
        key: '2007',
        isrpc: 0,
        scene: '020101841',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/code-cb61ecbf8365ca76b794e536e100c99a.png',
    },
]

export const KEPU_MENU = [
    { label: '健康科普', moudleId: '30', scene: '0201015' },
    { label: '慢病科普', moudleId: '18', scene: '0201045' },
    { label: '孕期科普', moudleId: '15', scene: '0201024' },
    { label: '育儿科普', moudleId: '14', scene: '0201036' },
]

export const HEALTH_TOOLS = [
    {
        label: 'BMI管理',
        moudleId: '35',
        scene: '0201011',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/bmi-8914f519f89bad3de311d653372fbcf6.png',
    },
    {
        label: '血压管理',
        url: `${TECENT_API_URL}/h5/open/translateCardPackParamsToEcardNo?ecardNo=&hospitalId=${HOSPITAL_ID}&redirect_uri=${encodeURIComponent(
            `${TECENT_URL}/h5/blood?cuid=1&hospitalId=${HOSPITAL_ID}`
        )}`,
        scene: '0201013',
        icon:
            'https://static.wecity.qq.com/lego_next_resources/xueya-af2fca23646cfaa56af97dd271046d9b.png',
    },
]
