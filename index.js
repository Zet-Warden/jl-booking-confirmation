const EXTRA_PERSON_FEE = 500;
const EXTRA_CHILD_FEE = EXTRA_PERSON_FEE / 2;
const EXTRA_BED_FEE = 500;
const PET_FEE = 400;

const STUDIO_PRICE = 2000;
const DELUXE_PRICE = 2400;
const TWIN_PRICE = 3000;
const TWO_BEDROOM_PRICE = 3000;
const TRIPLE_PRICE = 3000;
const FAMILY_PRICE = 4000;
const CONNECTING_PRICE = 4500;
const SUITE_PRICE = 3500;

const booking = {
    guestName: "",
    numAdults: 0,
    numChildren: 0,
    checkInDate: dayjs(), //today
    checkOutDate: dayjs().add(1, "day"), //tomorrow

    rooms: [],
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
    discountDescription: "",
    discount: 0,
    totalRoomCharge: 0,
    elTotalBalance: 0,
    remainingBalance: 0,

    // info to be pasted in google sheets
    bookingInfo: "",
};

// helper functions
function generateBookingId(modeOfPayment) {
    return (
        "JL" +
        new Date()
            .toLocaleDateString("en-US", {
                day: "numeric",
                month: "2-digit",
            })
            .replaceAll("/", "") +
        String(Math.floor(Math.random() * 10 ** 5)).padStart(5, 0)
    );
}

function getRoomPrice(roomType) {
    switch (roomType) {
        case "Studio":
        case "Studio w/ Balcony":
            return STUDIO_PRICE;
        case "Deluxe":
            return DELUXE_PRICE;
        case "Twin":
        case "S-Twin":
            return TWIN_PRICE;
        case "Two Bedroom":
            return TWO_BEDROOM_PRICE;
        case "Triple":
            return TRIPLE_PRICE;
        case "Family":
            return FAMILY_PRICE;
        case "Connecting":
            return CONNECTING_PRICE;
        case "Suite":
            return SUITE_PRICE;
    }
}

function formatCurrency(num) {
    return num.toLocaleString("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatOccupancy(numAdults, numChildren) {
    const adultStr = `${numAdults} adult`;
    const childrenStr = numChildren > 0 ? ` ${numChildren} child` : "";
    return `${adultStr}${childrenStr}`;
}

function copyNodeImageToClipboard(node) {
    htmlToImage
        .toBlob(node) // prevent scaling long booking confirmation to a smaller image
        .then(function (blob) {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
            alert("Successfully copied to clipboard!");
        })
        .catch(function (error) {
            console.error("oops, something went wrong!", error);
        });
}

function copyBookingInfoToClipboard() {
    // const bookingInfo = `${booking.guestName}\t${
    //     booking.bookingId
    // }\t${booking.checkInDate.format(
    //     "MMMM DD YYYY",
    // )}\t${booking.checkOutDate.format("MMMM DD YYYY")}\t${booking.numRooms}x ${
    //     booking.roomType
    // }\t${booking.numAdults + booking.extraAdult}\t${
    //     booking.numChildren + booking.extraChild
    // }\t\t${booking.remainingBalance}\t${booking.totalRoomCharge}\t0\t${
    //     booking.totalRoomCharge
    // }`;

    navigator.clipboard.writeText(booking.bookingInfo);
    alert("Successfully copied to clipboard!");
}

// DOM Nodes that hold input data
const ipGuestName = document.querySelector("#ip_guest_name");
const ipNumberOfAdults = document.querySelector("#ip_num_adults");
const ipNumberOfChildren = document.querySelector("#ip_num_children");
const ipCheckIn = document.querySelector("#ip_check-in");
const ipCheckOut = document.querySelector("#ip_check-out");

const ipRoomType = document.querySelector("#ip_room_type");
const ipRoomPrice = document.querySelector("#ip_room_price");
const ipNumRooms = document.querySelector("#ip_num_rooms");
const ipExtraAdult = document.querySelector("#ip_extra_adult");
const ipExtraChild = document.querySelector("#ip_extra_child");
const ipExtraBed = document.querySelector("#ip_extra_bed");
const ipNumberofPets = document.querySelector("#ip_num_pets");
const taAdminNotes = document.querySelector("#ta_admin_notes");
const taRemarks = document.querySelector("#ta_remarks");

const ipModeOfPayment = document.querySelector("#ip_mode_of_payment");
const ipPaymentReferenceNumber = document.querySelector(
    "#ip_payment_reference",
);
const ipDiscountDescription = document.querySelector(
    "#ip_discount_description",
);
const ipDiscount = document.querySelector("#ip_discount");
const ipDownpayment = document.querySelector("#ip_downpayment");
const ipBookingId = document.querySelector("#ip_booking_id");
const cbCustomBookingId = document.querySelector("#cb_custom_booking_id");

// DOM Nodes that represent each data to replace
const elReservationReceipt = document.querySelector("#reservation_receipt");
const elBookingId = document.querySelector("#booking_id");
const elPaymentDate = document.querySelector("#payment_date");

const elGuestName = document.querySelector("#guest_name");
const elNumberOfPersons = document.querySelector("#num_persons");
const elModeOfPayment = document.querySelector("#mode_of_payment");
const elPaymentReference = document.querySelector("#payment_reference");

const elPeriod = document.querySelector("#period");
const elNumNights = document.querySelector("#num_nights");
const elRoomType = document.querySelector("#room_type");
const elRoomPrice = document.querySelector("#room_price");
// const elNumRooms = document.querySelector("#num_rooms");

const elExtraPerson = document.querySelector("#extra_person");
const elExtraPersonCharge = document.querySelector("#extra_person_charge");

const elExtraBed = document.querySelector("#extra_bed");
const elExtraBedCharge = document.querySelector("#extra_bed_charge");

const elNumPets = document.querySelector("#num_pets");
const elPetCharge = document.querySelector("#pet_charge");

const elTotalRoomCharge = document.querySelector("#total_room_charge");

const elDiscountDescription = document.querySelector("#discount_description");
const elDiscount = document.querySelector("#discount");
const elDownpayment = document.querySelector("#downpayment");
const elTotalBalance = document.querySelector("#total_balance");
const elRemainingBalance = document.querySelector("#remaining_balance");

const elPaymentRemarks = document.querySelector("#payment_remarks");
const elAdditionalRemarks = document.querySelector("#addtnl_remarks");
const elCheckinRemarks = document.querySelector("#check-in_remarks");

const elBookingInfo = document.querySelector("#booking_info");

const elBookingConfirmationTitle = document.querySelector(
    "#booking_confirmation_title",
);

// default values
window.onload = () => {
    ipCheckIn.value = dayjs().format("YYYY-MM-DD");
    ipCheckOut.value = dayjs().add(1, "day").format("YYYY-MM-DD");

    ipCheckIn.min = dayjs().format("YYYY-MM-DD");
    ipCheckOut.min = dayjs().format("YYYY-MM-DD");

    ipRoomPrice.value = getRoomPrice(ipRoomType.value);
};

ipRoomType.onchange = () => {
    ipRoomPrice.value = getRoomPrice(ipRoomType.value);
};

//add room
const addRoomButton = document.querySelector("#add_room_btn");
addRoomButton.addEventListener("click", () => {
    const roomType = ipRoomType.value;
    const roomPrice = +ipRoomPrice.value;
    const numRooms = +ipNumRooms.value;

    const numAdults = +ipNumberOfAdults.value;
    const numChildren = +ipNumberOfChildren.value;

    const roomId = String(Math.floor(Math.random() * 10 ** 5)).padStart(5, 0);

    booking.rooms.push({
        id: roomId,
        roomType,
        roomPrice,
        numRooms,
        numAdults,
        numChildren,
    });

    const roomInfoContainer = document.querySelector("#rooms_info");
    const roomHTML = document.createElement("div");
    const roomInfo = document.createElement("span");
    const closeButton = document.createElement("span");

    roomInfo.appendChild(
        document.createTextNode(
            `${numRooms == 1 ? "" : numRooms + " "}${roomType}`,
        ),
    );
    roomInfo.appendChild(document.createElement("br"));
    roomInfo.appendChild(
        document.createTextNode(
            "(" + formatOccupancy(numAdults, numChildren) + ")",
        ),
    );

    closeButton.appendChild(document.createTextNode("X"));
    closeButton.setAttribute(
        "class",
        "cursor-pointer px-2 py-3 text-red-500 ml-4 font-bold absolute top-0 right-0",
    );
    closeButton.addEventListener("click", () => {
        roomHTML.remove();
        booking.rooms = booking.rooms.filter((room) => room.id != roomId);
    });

    roomHTML.setAttribute("id", roomId);
    roomHTML.setAttribute("class", "border px-2 py-3 w-32 relative");

    roomHTML.appendChild(roomInfo);
    roomHTML.appendChild(closeButton);

    roomInfoContainer.appendChild(roomHTML);

    // reset input fields
    ipNumberOfAdults.value = 1;
    ipNumberOfChildren.value = 0;
});

// generate booking confirmation receipt
const generateButton = document.querySelector("#generate_btn");
generateButton.addEventListener("click", () => {
    // set booking values
    booking.guestName = ipGuestName.value;
    booking.numAdults = booking.rooms.reduce(
        (numAdults, room) => numAdults + room.numAdults,
        0,
    );
    booking.numChildren = booking.rooms.reduce(
        (numChildren, room) => numChildren + room.numChildren,
        0,
    );
    booking.checkInDate = dayjs(ipCheckIn.value);
    booking.checkOutDate = dayjs(ipCheckOut.value);

    booking.roomType = ipRoomType.value;
    booking.roomPrice = +ipRoomPrice.valueAsNumber;
    booking.numRooms = +ipNumRooms.valueAsNumber;
    booking.extraAdult = +ipExtraAdult.valueAsNumber;
    booking.extraChild = +ipExtraChild.valueAsNumber;
    booking.extraBed = +ipExtraBed.valueAsNumber;
    booking.numPets = +ipNumberofPets.valueAsNumber;

    booking.modeOfPayment = ipModeOfPayment.value;
    booking.paymentReferenceNumber = ipPaymentReferenceNumber.value;
    booking.downpayment = +ipDownpayment.value;
    booking.discountDescription = ipDiscountDescription.value;
    booking.discount = +ipDiscount.value;

    const shouldUseCustomBookingId = cbCustomBookingId.checked;
    booking.bookingId = shouldUseCustomBookingId
        ? ipBookingId.value
        : generateBookingId(booking.modeOfPayment);
    ipBookingId.value = booking.bookingId;

    // take into account "nights" for day room
    // day room is considered 1 night for room price computation
    booking.numNights = Math.max(
        booking.checkOutDate.diff(booking.checkInDate, "day"),
        1,
    );

    // if using custom booking ID then the booking confirmation is an amendment
    elBookingConfirmationTitle.textContent = cbCustomBookingId
        ? "Amended Booking Confirmation"
        : "Booking Confirmation";

    // display booking values in HTML
    elBookingId.textContent = booking.bookingId;
    elPaymentDate.textContent = dayjs().format("MMMM DD, YYYY");
    elGuestName.textContent = booking.guestName;
    elNumberOfPersons.textContent = `${booking.numAdults} adult ${
        booking.numChildren > 0 ? `${booking.numChildren} child` : ""
    }`;
    elModeOfPayment.textContent = booking.modeOfPayment;
    elPaymentReference.textContent = booking.paymentReferenceNumber;

    elPeriod.textContent = `${booking.checkInDate.format(
        "MMM DD",
    )} - ${booking.checkOutDate.format("MMM DD")}`;
    elNumNights.textContent = booking.checkInDate.isSame(booking.checkOutDate)
        ? "Day Room"
        : booking.numNights + " night/s";

    elRoomType.innerHTML = booking.rooms.reduce(
        //add br line after the first element
        (acc, curr, index) =>
            `${acc} ${index ? "<br>" : ""} ${curr.roomType} (${formatOccupancy(curr.numAdults, curr.numChildren)})`,
        "",
    );
    elRoomPrice.innerHTML = booking.rooms.reduce(
        //add br line after the first element
        (acc, curr, index) =>
            `${acc} ${index ? "<br>" : ""} PHP ${formatCurrency(curr.roomPrice)} / night`,
        "",
    );
    elExtraPerson.textContent = `${
        booking.extraAdult > 0 ? `${booking.extraAdult} adult` : ""
    } ${booking.extraChild > 0 ? `${booking.extraChild} child` : ""}`;
    elExtraBed.textContent = booking.extraBed > 0 ? booking.extraBed : "";
    elNumPets.textContent = `${booking.numPets > 0 ? booking.numPets + " Pet" : ""}`;

    // elNumRooms.textContent = ipNumRooms.value;

    const extraPersonCharge =
        booking.numNights *
        (booking.extraAdult * EXTRA_PERSON_FEE +
            booking.extraChild * EXTRA_CHILD_FEE);
    elExtraPersonCharge.textContent = formatCurrency(extraPersonCharge);

    const extraBedCharge = booking.extraBed * EXTRA_BED_FEE * booking.numNights;
    elExtraBedCharge.textContent = formatCurrency(extraBedCharge);

    const petCharge = PET_FEE * booking.numPets * booking.numNights;
    elPetCharge.textContent = formatCurrency(petCharge);

    const roomCharge = booking.rooms.reduce(
        // room charge for all rooms for the entire stay
        (roomCharge, room) => roomCharge + room.roomPrice * booking.numNights,
        0,
    );
    const totalRoomCharge =
        roomCharge + extraPersonCharge + extraBedCharge + petCharge;

    const totalBalance = totalRoomCharge - booking.discount;
    const remainingBalance = totalBalance - booking.downpayment;

    booking.totalRoomCharge = totalRoomCharge;
    booking.totalBalance = totalBalance;
    booking.remainingBalance = remainingBalance;

    elTotalRoomCharge.textContent = formatCurrency(totalRoomCharge);
    elDownpayment.textContent = formatCurrency(booking.downpayment);
    elDiscount.textContent = formatCurrency(booking.discount);
    elDiscountDescription.textContent = booking.discountDescription
        ? `(${booking.discountDescription})`
        : "";

    elTotalBalance.textContent = formatCurrency(totalBalance);
    elRemainingBalance.textContent = formatCurrency(remainingBalance);
    elPaymentRemarks.textContent = formatCurrency(remainingBalance);
    elCheckinRemarks.textContent = booking.checkInDate.format(
        "dddd, MMMM DD, YYYY",
    );

    const additionalRemarks = taRemarks.value.split("\n");
    const additionalRemarksHTML = additionalRemarks.map(
        (remark) => `<p>${remark.trim()}</p>`,
    );
    elAdditionalRemarks.innerHTML = additionalRemarksHTML.join(" ");

    // get booking info to copy paste to google sheets
    const checkIn = booking.checkInDate.format("MMMM DD YYYY");
    const checkOut = booking.checkOutDate.format("MMMM DD YYYY");
    const roomCount = booking.rooms.reduce((tracker, room) => {
        tracker[room.roomType] =
            tracker[room.roomType] == undefined
                ? 1
                : tracker[room.roomType] + 1;
        return tracker;
    }, {});
    const rooms = Object.keys(roomCount)
        .map((roomType) => `${roomCount[roomType]}x ${roomType}`)
        .join(", ");
    const adminNotes = taAdminNotes.value;

    /**
     * NOTE:
     * add quotation in between ${adminNotes} to properly copy multi-line texts in Google Sheets cell
     */
    booking.bookingInfo = `${booking.guestName}\t${
        booking.bookingId
    }\t${checkIn}\t${checkOut}\t${rooms}\t${booking.numAdults + booking.extraAdult}\t${
        booking.numChildren + booking.extraChild
    }\t"${adminNotes}"\t${booking.remainingBalance}\t${booking.totalRoomCharge}\t${booking.totalRoomCharge - booking.totalBalance}\t${
        booking.totalBalance
    }`;
    elBookingInfo.textContent = booking.bookingInfo;

    // change document title
    document.title = `[Jaelle Residences] ${booking.bookingId} - ${booking.guestName}`;
});

// copy booking receipt image to clipboard
const copyButton = document.querySelector("#copy_btn");
copyButton.addEventListener("click", () => {
    copyNodeImageToClipboard(elReservationReceipt);
});

const copyInfoButton = document.querySelector("#copy_info_btn");
copyInfoButton.addEventListener("click", () => {
    copyBookingInfoToClipboard();
});

const printButton = document.querySelector("#print_btn");
printButton.addEventListener("click", () => {
    window.print();
});
