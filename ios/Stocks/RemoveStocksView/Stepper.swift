//
//  Stepper.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct StepperView: View {
    @State private var amount = 0
    var stock: Stock
    var portfolio: Portfolio
    var portfolioEntry: PortfolioEntry
    
    func incrementStep() {
        amount += 1
        portfolio.addStockToPortfolio(stock: stock, amount: 1)
    }
    
    func decrementStep() {
        if (portfolioEntry.get_amount() > 0) {
            amount -= 1
            portfolio.removeONEStockFromPortfolio(stock: stock)
        }
    }
    
    var body: some View {
        HStack{
            Text("Amount: \(portfolioEntry.get_amount())        ")
            Stepper {
            } onIncrement: {
                incrementStep()
            } onDecrement: {
                decrementStep()
            }
            .padding(5)
            .frame(width: 100, height: 35)
            .offset(x: -4)
            .background(Color.white)
            .cornerRadius(8)
        }
    }
    
}
