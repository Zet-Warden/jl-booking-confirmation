const EXTRA_PERSON_FEE = 500;
const EXTRA_CHILD_FEE = EXTRA_PERSON_FEE / 2;
const EXTRA_BED_FEE = 500;
const PET_FEE = 400;

const STUDIO_PRICE = 2000;
const TWIN_PRICE = 3000;
const TWO_BEDROOM_PRICE = 3000;
const TRIPLE_PRICE = 3000;
const FAMILY_PRICE = 3800;
const CONNECTING_PRICE = 4300;
const SUITE_PRICE = 3500;

const booking = {
    guestName: '',
    numAdults: 0,
    numChildren: 0,
    checkInDate: dayjs(), //today
    checkOutDate: dayjs().add(1, 'day'), //tomorrow

    roomType: null,
    roomPrice: null,
    numRooms: 0,
    extraAdult: 0,
    extraChild: 0,
    extraBed: 0,
    numPets: 0,

    modeOfPayment: null,
    paymentReferenceNumber: null,
    downpayment: 0,
    bookingId: null,

    numNights: 0,
    totalBalance: 0,
};

// helper functions
function generateBookingId(modeOfPayment) {
    const getPrefix = () => {
        switch (modeOfPayment) {
            case 'gcash':
                return 'GC';
            case 'credit_card':
                return 'CC';
            case 'cash':
                return 'CA';
        }
    };

    return (
        'JL' +
        getPrefix(modeOfPayment) +
        new Date()
            .toLocaleDateString('en-US', {
                day: 'numeric',
                month: '2-digit',
            })
            .replaceAll('/', '') +
        String(Math.floor(Math.random() * 10 ** 5)).padStart(5, 0)
    );
}

function getRoomPrice(roomType) {
    switch (roomType) {
        case 'Studio':
            return STUDIO_PRICE;
        case 'Twin':
            return TWIN_PRICE;
        case 'Two Bedroom':
            return TWO_BEDROOM_PRICE;
        case 'Triple':
            return TRIPLE_PRICE;
        case 'Family':
            return FAMILY_PRICE;
        case 'Connecting':
            return CONNECTING_PRICE;
        case 'Suite':
            return SUITE_PRICE;
    }
}

function formatCurrency(num) {
    return num.toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function copyNodeImageToClipboard(node) {
    htmlToImage
        .toBlob(node)
        .then(function (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            alert('Successfully copied to clipboard!');
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}

function copyBookingInfoToClipboard() {
    const bookingInfo = `${booking.guestName}\t${
        booking.bookingId
    }\t${booking.checkInDate.format(
        'MMMM DD YYYY'
    )}\t${booking.checkOutDate.format('MMMM DD YYYY')}\t${booking.roomType}\t${
        booking.numAdults + booking.extraAdult
    }\t${booking.numChildren + booking.extraChild}\t\t${
        booking.totalBalance - booking.downpayment
    }\t${booking.totalBalance}\t0\t${booking.totalBalance}`;

    navigator.clipboard.writeText(bookingInfo);
    alert('Successfully copied to clipboard!');
}

// DOM Nodes that hold input data
const ipGuestName = document.querySelector('#ip_guest_name');
const ipNumberOfAdults = document.querySelector('#ip_num_adults');
const ipNumberOfChildren = document.querySelector('#ip_num_children');
const ipCheckIn = document.querySelector('#ip_check-in');
const ipCheckOut = document.querySelector('#ip_check-out');

const ipRoomType = document.querySelector('#ip_room_type');
const ipRoomPrice = document.querySelector('#ip_room_price');
const ipNumRooms = document.querySelector('#ip_num_rooms');
const ipExtraAdult = document.querySelector('#ip_extra_adult');
const ipExtraChild = document.querySelector('#ip_extra_child');
const ipExtraBed = document.querySelector('#ip_extra_bed');
const ipNumberofPets = document.querySelector('#ip_num_pets');

const ipModeOfPayment = document.querySelector('#ip_mode_of_payment');
const ipPaymentReferenceNumber = document.querySelector(
    '#ip_payment_reference'
);
const ipDownpayment = document.querySelector('#ip_downpayment');
const ipBookingId = document.querySelector('#ip_booking_id');

// DOM Nodes that represent each data to replace
const elReservationReceipt = document.querySelector('#reservation_receipt');
const elBookingId = document.querySelector('#booking_id');
const elPaymentDate = document.querySelector('#payment_date');

const elGuestName = document.querySelector('#guest_name');
const elNumberOfPersons = document.querySelector('#num_persons');
const elModeOfPayment = document.querySelector('#mode_of_payment');
const elPaymentReference = document.querySelector('#payment_reference');

const elPeriod = document.querySelector('#period');
const elNumNights = document.querySelector('#num_nights');
const elRoomType = document.querySelector('#room_type');
const elRoomPrice = document.querySelector('#room_price');
const elNumRooms = document.querySelector('#num_rooms');

const elExtraPerson = document.querySelector('#extra_person');
const elExtraPersonCharge = document.querySelector('#extra_person_charge');

const elExtraBed = document.querySelector('#extra_bed');
const elExtraBedCharge = document.querySelector('#extra_bed_charge');

const elNumPets = document.querySelector('#num_pets');
const elPetCharge = document.querySelector('#pet_charge');

const elTotalRoomCharge = document.querySelector('#total_room_charge');

const elDownpayment = document.querySelector('#downpayment');
const elTotalBalance = document.querySelector('#total_balance');

const elPaymentRemarks = document.querySelector('#payment_remarks');
const elCheckinRemarks = document.querySelector('#check-in_remarks');

const elBookingInfo = document.querySelector('#booking_info');

// default values
window.onload = () => {
    ipCheckIn.value = dayjs().format('YYYY-MM-DD');
    ipCheckOut.value = dayjs().add(1, 'day').format('YYYY-MM-DD');

    ipCheckIn.min = dayjs().format('YYYY-MM-DD');
    ipCheckOut.min = dayjs().format('YYYY-MM-DD');

    ipRoomPrice.value = getRoomPrice(ipRoomType.value);
};

ipRoomType.onchange = () => {
    ipRoomPrice.value = getRoomPrice(ipRoomType.value);
};

// generate booking confirmation receipt
const generateButton = document.querySelector('#generate_btn');
generateButton.addEventListener('click', () => {
    // get booking values
    booking.guestName = ipGuestName.value;
    booking.numAdults = +ipNumberOfAdults.value;
    booking.numChildren = +ipNumberOfChildren.value;
    booking.checkInDate = dayjs(ipCheckIn.value);
    booking.checkOutDate = dayjs(ipCheckOut.value);

    booking.roomType = ipRoomType.value;
    booking.roomPrice = +ipRoomPrice.value;
    booking.numRooms = +ipNumRooms.value;
    booking.extraAdult = +ipExtraAdult.value;
    booking.extraChild = +ipExtraChild.value;
    booking.extraBed = +ipExtraBed.value;
    booking.numPets = +ipNumberofPets.value;

    booking.modeOfPayment = ipModeOfPayment.value;
    booking.paymentReferenceNumber = ipPaymentReferenceNumber.value;
    booking.downpayment = +ipDownpayment.value;
    ipBookingId.value = generateBookingId(booking.modeOfPayment);
    booking.bookingId = ipBookingId.value;

    // take into account "nights" for day room
    booking.numNights = Math.max(
        booking.checkOutDate.diff(booking.checkInDate, 'day'),
        1
    );

    // set booking values
    elBookingId.textContent = booking.bookingId;
    elPaymentDate.textContent = dayjs().format('MMMM DD, YYYY');
    elGuestName.textContent = booking.guestName;
    elNumberOfPersons.textContent = `${booking.numAdults} adult ${
        booking.numChildren > 0 ? `${booking.numChildren} child` : ''
    }`;
    elPaymentReference.textContent = booking.paymentReferenceNumber;

    elPeriod.textContent = `${booking.checkInDate.format(
        'MMM DD'
    )} - ${booking.checkOutDate.format('MMM DD')}`;
    elNumNights.textContent = booking.checkInDate.isSame(booking.checkOutDate)
        ? 'Day Room'
        : booking.numNights + ' night/s';

    elRoomType.textContent = ipRoomType.value;
    elRoomPrice.textContent = formatCurrency(booking.roomPrice);

    elNumRooms.textContent = ipNumRooms.value;

    const extraPersonCharge =
        booking.numNights *
        (booking.extraAdult * EXTRA_PERSON_FEE +
            booking.extraChild * EXTRA_CHILD_FEE);
    elExtraPerson.textContent = `${
        booking.extraAdult > 0 ? `${booking.extraAdult} adult` : ''
    } ${booking.extraChild > 0 ? `${booking.extraChild} child` : ''}`;
    elExtraPersonCharge.textContent = formatCurrency(extraPersonCharge);

    const extraBedCharge = booking.extraBed * EXTRA_BED_FEE * booking.numNights;
    elExtraBed.textContent = booking.extraBed > 0 ? booking.extraBed : '';
    elExtraBedCharge.textContent = formatCurrency(extraBedCharge);

    const petCharge = PET_FEE * booking.numPets * booking.numNights;
    elNumPets.textContent = `${booking.numPets > 0 ? booking.numPets : ''}`;
    elPetCharge.textContent = formatCurrency(petCharge);

    // calculate total room charge
    const roomCharge = booking.roomPrice * booking.numNights;
    const totalRoomCharge =
        roomCharge * booking.numRooms +
        extraPersonCharge +
        extraBedCharge +
        petCharge;
    elTotalRoomCharge.textContent = formatCurrency(totalRoomCharge);
    elDownpayment.textContent = formatCurrency(booking.downpayment);

    const totalBalance = totalRoomCharge - booking.downpayment;
    booking.totalBalance = totalBalance;
    elTotalBalance.textContent = formatCurrency(totalBalance);
    elPaymentRemarks.textContent = formatCurrency(totalBalance);
    elCheckinRemarks.textContent = booking.checkInDate.format(
        'dddd, MMMM DD, YYYY'
    );

    elBookingInfo.textContent = `${booking.guestName}\t${
        booking.bookingId
    }\t${booking.checkInDate.format(
        'MMMM DD YYYY'
    )}\t${booking.checkOutDate.format('MMMM DD YYYY')}\t${booking.roomType}\t${
        booking.numAdults + booking.extraAdult
    }\t${booking.numChildren + booking.extraChild}\t\t${
        booking.totalBalance - booking.downpayment
    }\t${booking.totalBalance}\t0\t${booking.totalBalance}`;

    // change document title
    document.title = `[Jaelle Residences] ${booking.bookingId} - ${booking.guestName}`;
});

// copy booking receipt image to clipboard
const copyButton = document.querySelector('#copy_btn');
copyButton.addEventListener('click', () => {
    copyNodeImageToClipboard(elReservationReceipt);
});

const copyInfoButton = document.querySelector('#copy_info_btn');
copyInfoButton.onclick = () => {
    copyBookingInfoToClipboard();
};
