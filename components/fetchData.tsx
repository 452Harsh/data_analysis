'use server'
export const fetchData = async () => {
    try {
        const res = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=ZYnYifuBP2nEbe55pEbNYu4p1RfKDVv1R88YfRCg1n1BgjkwjxtQwOy6eCeuhaLHDRjLagCN_Svn-iJkhiIRclIj-NASCy1xm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF-Yvh1rg39QJHB86MjgPDu6Yw7pUFg13oTPp0RaehLNGEIhLppdgW2nIgeY26xxxEIVlqbwnv5nuUpaBiLfOvh_xm-iequnGQ&lib=MVp36in8q1UyLv7ba2j2MIj4e5fkJzZ6i');
        const result = await res.json();
        return result.data;
        //   setData(result.data);
    } catch (error) {
        console.error(error);
    }
}