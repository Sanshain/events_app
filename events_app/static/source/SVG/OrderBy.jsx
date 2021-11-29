import { h } from 'preact';

const OrderByIcon = ({ className, styles, onClick}) => (
    <svg className={className} style={styles} onClick={onClick} id="mdi-sort-ascending" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 17H22L18 21L14 17H17V3H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z" />
    </svg>
);

export default OrderByIcon;
